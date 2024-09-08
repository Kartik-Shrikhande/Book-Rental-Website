import { Request, Response } from 'express'
import User from '../models/userModel'


//------------------------------------- user create API --------------------------------------------//

export const userCreate = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, gender, age } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }
    const newUser = new User({
      name,
      email,
      phone,
      gender,
      age
    })

    await newUser.save()
    return res.status(201).json({ message: 'User created successfully', user: newUser })
  }
  catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}


//------------------------------------- get All Users API --------------------------------------------//

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ isDeleted: false })
    return res.status(200).json({ total: users.length, users: users })
  }
  catch (error) {
    return res.status(500).json({ error: 'Error fetching users' })
  }
}


//--------------------------------------------------------------------------------------------//


