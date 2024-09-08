import mongoose, { Schema } from 'mongoose'

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
},
  { timestamps: true })

export default mongoose.model('User', UserSchema)

