import express from 'express'
import { getUsers, userCreate } from '../controllers/userControllers'
const router = express.Router()

router.get('/users', getUsers)
router.post('/create', userCreate)

export default router
