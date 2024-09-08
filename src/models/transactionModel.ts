import mongoose, { Schema } from 'mongoose'

const TransactionSchema: Schema = new Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  totalRent: {
    type: Number
  }
},
  { timestamps: true })

export default mongoose.model('Transaction', TransactionSchema)
