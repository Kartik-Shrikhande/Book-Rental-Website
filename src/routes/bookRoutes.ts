import express from 'express'
import { getBooksByName, getBooksByRentRange, getBooksByCategoryAndRent, createBook, getAllBooks } from '../controllers/bookController'
const router = express.Router()

router.post('/books/create', createBook)
router.get('/books/allBooks', getAllBooks)
router.get('/books/name', getBooksByName)
router.get('/books/rent', getBooksByRentRange)
router.get('/books/category-rent', getBooksByCategoryAndRent)

export default router
