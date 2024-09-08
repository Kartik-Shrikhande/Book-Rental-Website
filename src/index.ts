import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/userRoutes'
import bookRouter from './routes/bookRoutes'
import transactionRouter from './routes/transactionRoutes'
require("dotenv").config()

const app = express()

app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/books', bookRouter)
app.use('/api/transactions', transactionRouter)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})


