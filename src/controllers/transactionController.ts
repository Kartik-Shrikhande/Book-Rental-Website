import { Request, Response } from 'express'
import Transaction from '../models/transactionModel'
import User from '../models/userModel'
import Book from '../models/bookModel'


//-------------------------------issue Book--------------------------------------------------//

export const issueBook = async (req: Request, res: Response) => {
  try {
    const { bookName, userId, issueDate } = req.body
    const book = await Book.findOne({ bookName })
    if (!book) return res.status(404).json({ message: 'Book not found' })

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Create a new transaction
    const transaction = new Transaction({
      bookId: book._id,
      userId: user._id,
      issueDate: new Date(issueDate)
    })
    await transaction.save()
    return res.status(201).json({ message: 'Book issued successfully', transaction })
  }
  catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}


//-------------------------------return Book--------------------------------------------------//

export const returnBook = async (req: Request, res: Response) => {
  try {
    const { bookId, userId, returnDate } = req.body
    if (!bookId || !userId || !returnDate) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    const transaction = await Transaction.findOne({ bookId, userId, returnDate: null })
    if (!transaction) return res.status(404).json({ message: 'No active transaction found' })

    const issueDate = transaction.issueDate
    if (!(issueDate instanceof Date)) return res.status(400).json({ message: 'Invalid issue date format' })

    const daysRented = Math.ceil((new Date(returnDate).getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24))

    const book = await Book.findById(bookId)
    if (!book) return res.status(404).json({ message: 'Book not found' })

    const rentPerDay: number = book.rentPerDay as number || 0

    transaction.returnDate = new Date(returnDate)
    transaction.totalRent = daysRented * rentPerDay

    await transaction.save()
    return res.status(200).json({ message: 'Book returned successfully', transaction })
  }
  catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}


//-------------------------------get Book Transactions--------------------------------------------------//

export const getBookTransactions = async (req: Request, res: Response) => {
  try {
    const bookName = req.query.bookName as string

    if (!bookName) {
      return res.status(400).json({ message: 'Book name is required' });
    }

    // Validate book with case-insensitive search
    const book = await Book.findOne({ bookName: { $regex: new RegExp(bookName, 'i') } });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    // Find all transactions related to this book
    const transactions = await Transaction.find({ bookId: book._id }).populate('userId')

    const totalIssued = transactions.length
    const currentlyIssued = transactions.find(transaction => !transaction.returnDate)

    return res.status(200).json({
      totalIssued,
      currentlyIssued: currentlyIssued
        ? { user: currentlyIssued.userId, issuedOn: currentlyIssued.issueDate }
        : 'Book is not currently issued',
    })
  }
  catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}


//-------------------------------get Total Rent For Book--------------------------------------------------//

export const getTotalRentForBook = async (req: Request, res: Response) => {
  try {
    const bookName = req.query.bookName as string

    if (!bookName) {
      return res.status(400).json({ message: 'Missing bookName query parameter' });
    }

    // Validate book with case-insensitive search
    const book = await Book.findOne({ bookName: { $regex: new RegExp(bookName, 'i') } });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Find all transactions where rent was paid for this book
    const transactions = await Transaction.find({ bookId: book._id, totalRent: { $exists: true } })

    // Calculate total rent
    const totalRent = transactions.reduce((sum, transaction) => {
      const rent = transaction.totalRent as number
      return sum + (rent || 0)
    }, 0)
    return res.status(200).json({ totalRent })
  }
  catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}


//-------------------------------get Books Issued To User--------------------------------------------------//

export const getBooksIssuedToUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const transactions = await Transaction.find({ userId: user._id }).populate('bookId')

    const booksIssued = transactions.map(transaction => ({
      book: transaction.bookId,
      issuedOn: transaction.issueDate,
      returnedOn: transaction.returnDate || 'Not yet returned',
    }))

    return res.status(200).json({ booksIssued })
  }
  catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}


//-------------------------------get Books Issued In DateRange--------------------------------------------------//

export const getBooksIssuedInDateRange = async (req: Request, res: Response) => {
  try {
    // Extract startDate and endDate from the query and cast them as strings
    const startDate = req.query.startDate as string
    const endDate = req.query.endDate as string

    // Ensure that both startDate and endDate are valid strings
    if (!startDate || !endDate) return res.status(400).json({ message: 'Please provide both startDate and endDate' })

    // Find transactions issued within the date range
    const transactions = await Transaction.find({
      issueDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate('bookId userId')

    const booksIssued = transactions.map(transaction => ({
      book: transaction.bookId,
      issuedTo: transaction.userId,
      issuedOn: transaction.issueDate,
    }))

    return res.status(200).json({ total: booksIssued.length, BooksIssued: booksIssued })
  }
  catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

//--------------------------------------------------------------------------------------------//

