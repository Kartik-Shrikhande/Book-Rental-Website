import mongoose, { Schema } from 'mongoose'

const BookSchema: Schema = new Schema({
  bookName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  rentPerDay: {
    type: Number,
    required: true
  }
},
  { timestamps: true })

export default mongoose.model('Book', BookSchema)


