import express from 'express'
import { getBooksIssuedInDateRange, getBooksIssuedToUser, getBookTransactions, getTotalRentForBook, issueBook, returnBook } from '../controllers/transactionController'
const router = express.Router()

router.post('/transactions/issue', issueBook)
router.post('/transactions/return', returnBook)
router.get('/transactions/books', getBookTransactions)
router.get('/transactions/rent',getTotalRentForBook)
router.get('/transactions/user',getBooksIssuedToUser)
router.get('/transactions/date',getBooksIssuedInDateRange)

export default router

