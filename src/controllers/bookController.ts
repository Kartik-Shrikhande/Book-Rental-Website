import { Request, Response } from 'express'
import Book from '../models/bookModel'


//---------------------------Create Book API--------------------------------------------//

export const createBook = async (req: Request, res: Response) => {
  try {
    const { bookName, category, rentPerDay } = req.body
    if (!bookName || !category || !rentPerDay) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const newBook = new Book({
      bookName,
      category,
      rentPerDay
    })

    const savedBook = await newBook.save()
    return res.status(201).json(savedBook)
  }
  catch (error) {
    return res.status(500).json({ message: 'Error creating book', error: error.message })
  }
}


//-------------------------get All Books API--------------------------------------------//

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find({})
    return res.status(200).json({ total: books.length, Books: books })
  }
  catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}


//-------------------------get Books By Name API--------------------------------------------//

export const getBooksByName = async (req: Request, res: Response) => {
  const { bookName } = req.query
  try {
    if (!bookName) {
      return res.status(400).json({ message: 'Book name is required' })
    }
    const books = await Book.find({ bookName: new RegExp(bookName as string, 'i') })
    return res.status(200).json(books)
  }
  catch (error) {
    return res.status(500).json({ message: 'Error fetching books', error: error.message })
  }
}


//-------------------------------get Books By RentRange API--------------------------------------------//

export const getBooksByRentRange = async (req: Request, res: Response) => {
  const { minRent, maxRent } = req.query
  try {
    if (minRent === undefined || maxRent === undefined) {
      return res.status(400).json({ message: 'Both minRent and maxRent are required' })
    }
    const books = await Book.find({ rentPerDay: { $gte: Number(minRent), $lte: Number(maxRent) } })
    return res.status(200).json({ total: books.length, Books: books })
  }
  catch (error) {
    return res.status(500).json({ message: 'Error fetching books', error: error.message })
  }
}


//-------------------------------------get Books By Category And Rent --------------------------------------------//

export const getBooksByCategoryAndRent = async (req: Request, res: Response) => {
  try {
    const { category, bookName, minRent, maxRent } = req.query
    const query: any = {}

    if (category) {
      query.category = new RegExp(category as string, 'i')
    }
    if (bookName) {
      query.bookName = new RegExp(bookName as string, 'i')
    }
    // Find books with rent greater than or equal to minRent or maxRent
    if (minRent || maxRent) {
      query.rentPerDay = {}
      if (minRent) {
        query.rentPerDay.$gte = Number(minRent)
      }
      if (maxRent) {
        query.rentPerDay.$lte = Number(maxRent)
      }
    }
    // Find books based on the filters
    const books = await Book.find(query)
    return res.status(200).json({ total: books.length, Books: books })
  }
  catch (error) {
    return res.status(500).json({ message: 'Error fetching books', error: error.message })
  }
}


//---------------------------------------------------------------------------------------//