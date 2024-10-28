require('dotenv').config()

const config = require('./config.json')
const mongoose = require('mongoose')
const bcrpyt = require('bcrypt')
const express = require('express')
const cors = require('cors')

const jwt = require('jsonwebtoken')

mongoose.connect(config.connectionString)

const User = require('./models/user.model')

const app = express()
app.use(express.json())
app.use(cors({ origin: '*' }))

//Create Account
app.post('/create-account', async (req, res) => {
   const { fullName, email, password } = req.body
   if (!fullName || !email || !password) {
      return res.status(400).json({ error: true, message: 'All fields are required' })
   }
   const isUser = await User.findOne({ email })
   if (isUser) {
      return res.status(400).json({ error: true, message: 'User already exists' })
   }

   const hashedPassword = await bcrpyt.hash(password, 10)
   const user = new User({
      fullName,
      email,
      password: hashedPassword,
   })

   await user.save()
   const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '72h',
   })

   return res.status(201).json({
      error: false,
      user: {
         error: false,
         fullName: user.fullName,
         email: user.email,
      },
      accessToken,
      message: 'User created successfully',
   })
})

//User Login
app.post('/login', async (req, res) => {
   const { email, password } = req.body
   if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required' })
   }
   const user = await User.findOne({ email })
   if (!user) {
      return res.status(400).json({ error: true, message: 'User not found' })
   }

   const isPasswordValid = await bcrpyt.compare(password, user.password)
   if (!isPasswordValid) {
      return res.status(400).json({ error: true, message: 'Invalid Credentials' })
   }
   const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '72h',
   })
   return res.json({
      error: false,
      message: 'Login successful',
      user: {
         fullName: user.fullName,
         email: user.email,
         accessToken,
      },
   })
})

app.listen(8000, () => {
   console.log('Backend server is running on port 8000')
})
module.exports = app
