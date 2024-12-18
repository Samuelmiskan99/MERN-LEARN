require('dotenv').config()

const config = require('./config.json')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const express = require('express')
const cors = require('cors')

const jwt = require('jsonwebtoken')
const upload = require('./multer')
const fs = require('fs')
const path = require('path')

const { authenticateToken } = require('./utilities')

// Connect to MongoDB without deprecated options
mongoose
   .connect(config.connectionString)
   .then(() => console.log('Database connected successfully'))
   .catch((error) => console.error('Database connection error:', error))

const User = require('./models/user.model')
const TravelStory = require('./models/travelStory.model')

const app = express()
app.use(express.json())
app.use(
   cors({
      origin: ['http://story-travel-mern-v1.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
   })
)

// Create Account
app.post('/create-account', async (req, res) => {
   const { fullName, email, password } = req.body
   if (!fullName || !email || !password) {
      return res.status(400).json({ error: true, message: 'All fields are required' })
   }
   const isUser = await User.findOne({ email })
   if (isUser) {
      return res.status(400).json({ error: true, message: 'User already exists' })
   }

   const hashedPassword = await bcrypt.hash(password, 10)
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
         fullName: user.fullName,
         email: user.email,
      },
      accessToken,
      message: 'User created successfully',
   })
})

// User Login
app.post('/login', async (req, res) => {
   const { email, password } = req.body
   if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required' })
   }
   const user = await User.findOne({ email })
   if (!user) {
      return res.status(400).json({ error: true, message: 'User not found' })
   }
   const isPasswordValid = await bcrypt.compare(password, user.password)
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

// Get User
app.get('/get-user', authenticateToken, async (req, res) => {
   try {
      const { userId } = req.user

      const isUser = await User.findOne({ _id: userId })
      if (!isUser) {
         return res.sendStatus(404)
      }

      return res.json({
         user: isUser,
         message: 'User fetched successfully',
      })
   } catch (error) {
      console.error('Error fetching user:', error)
      return res.sendStatus(500)
   }
})

// Image Upload
app.post('/image-upload', upload.single('image'), async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({ error: true, message: 'No image uploaded' })
      }

      const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`
      console.log('Uploaded image URL:', imageUrl)

      res.status(201).json({ error: false, imageUrl })
   } catch (error) {
      res.status(500).json({ error: true, message: error.message })
   }
})

// Delete Image
app.delete('/delete-image', async (req, res) => {
   const { imageUrl } = req.query
   if (!imageUrl) {
      return res.status(400).json({ error: true, message: 'ImageUrl parameter is required' })
   }
   try {
      const filename = path.basename(imageUrl)
      const filePath = path.join(__dirname, 'uploads', filename)
      if (fs.existsSync(filePath)) {
         fs.unlinkSync(filePath)
         return res.status(200).json({ error: false, message: 'Image deleted successfully' })
      } else {
         return res.status(404).json({ error: true, message: 'Image not found' })
      }
   } catch (error) {
      res.status(500).json({ error: true, message: error.message })
   }
})

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Add Travel Story
app.post('/add-travel-story', authenticateToken, async (req, res) => {
   const { title, story, visitedLocation, imageUrl, visitedDate } = req.body
   const { userId } = req.user

   if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
      return res.status(400).json({ error: true, message: 'All fields are required' })
   }

   const parsedVisitedDate = new Date(parseInt(visitedDate))
   try {
      const travelStory = new TravelStory({
         title,
         story,
         visitedLocation,
         userId,
         imageUrl,
         visitedDate: parsedVisitedDate,
      })
      await travelStory.save()
      res.status(201).json({
         story: travelStory,
         message: 'Travel story created successfully',
      })
   } catch (error) {
      res.status(500).json({
         error: true,
         message: error.message,
      })
   }
})

// Get All Travel Stories
app.get('/get-all-stories', authenticateToken, async (req, res) => {
   const { userId } = req.user
   try {
      const travelStories = await TravelStory.find({ userId }).sort({ isFavorite: -1 })
      res.status(200).json({ stories: travelStories })
   } catch (error) {
      res.status(500).json({
         error: true,
         message: error.message,
      })
   }
})

// Edit Travel Story
app.put('/edit-story/:id', authenticateToken, async (req, res) => {
   const { id } = req.params
   const { title, story, visitedLocation, imageUrl, visitedDate } = req.body
   const { userId } = req.user

   if (!title || !story || !visitedLocation || !visitedDate) {
      return res.status(400).json({ error: true, message: 'All fields are required' })
   }

   const parsedVisitedDate = new Date(parseInt(visitedDate))
   try {
      const travelStory = await TravelStory.findOne({ _id: id, userId })

      if (!travelStory) {
         return res.status(404).json({ error: true, message: 'Travel story not found' })
      }

      const placeholderImgUrl = `http://localhost:8000/uploads/placeholder.png`

      travelStory.title = title
      travelStory.story = story
      travelStory.visitedLocation = visitedLocation
      travelStory.imageUrl = imageUrl || placeholderImgUrl
      travelStory.visitedDate = parsedVisitedDate

      await travelStory.save()

      res.status(200).json({
         story: travelStory,
         message: 'Travel story updated successfully',
      })
   } catch (error) {
      res.status(500).json({
         error: true,
         message: error.message,
      })
   }
})

// Delete Travel Story
app.delete('/delete-story/:id', authenticateToken, async (req, res) => {
   const { id } = req.params
   const { userId } = req.user

   try {
      const travelStory = await TravelStory.findOne({ _id: id, userId })

      if (!travelStory) {
         return res.status(404).json({ error: true, message: 'Travel story not found' })
      }

      await travelStory.deleteOne()

      const imageUrl = travelStory.imageUrl
      const filename = path.basename(imageUrl)
      const filePath = path.join(__dirname, 'uploads', filename)

      fs.unlink(filePath, (err) => {
         if (err) {
            console.log('Failed to delete the image file', err)
            return res.status(500).json({
               error: true,
               message: 'Failed to delete the image file',
            })
         } else {
            console.log('Successfully deleted the image file')
            return res.status(200).json({
               error: false,
               message: 'Travel story deleted successfully',
            })
         }
      })
   } catch (error) {
      console.error(error)
      return res.status(500).json({
         error: true,
         message: 'Failed to delete the travel story, please check your correct storyID',
      })
   }
})

// Update isFavorite
app.put('/update-favorite/:id', authenticateToken, async (req, res) => {
   const { id } = req.params
   const { isFavorite } = req.body
   const { userId } = req.user

   try {
      const travelStory = await TravelStory.findOne({ _id: id, userId })
      if (!travelStory) {
         return res.status(404).json({ error: true, message: 'Travel story not found' })
      }

      travelStory.isFavorite = isFavorite

      await travelStory.save()
      res.status(200).json({ story: travelStory, message: 'Travel story updated successfully' })
   } catch (error) {
      res.status(500).json({ error: true, message: error.message })
   }
})

// Search Travel Story
app.get('/search-story', authenticateToken, async (req, res) => {
   const { userId } = req.user
   const { query } = req.query

   if (!query) {
      return res.status(400).json({ error: true, message: 'Query is required' })
   }

   try {
      const searchResults = await TravelStory.find({
         userId,
         $or: [
            { title: { $regex: query, $options: 'i' } },
            { story: { $regex: query, $options: 'i' } },
            { visitedLocation: { $regex: query, $options: 'i' } },
         ],
      }).sort({ isFavorite: -1 })

      res.status(200).json({ stories: searchResults })
   } catch (error) {
      res.status(500).json({ error: true, message: error.message })
   }
})

// Filter Travel Stories by Date Range
app.get('/filter-story', authenticateToken, async (req, res) => {
   const { startDate, endDate } = req.query
   const { userId } = req.user

   try {
      const start = new Date(parseInt(startDate))
      const end = new Date(parseInt(endDate))

      const filteredStories = await TravelStory.find({
         userId,
         visitedDate: { $gte: start, $lte: end },
      }).sort({ isFavorite: -1 })

      res.status(200).json({ stories: filteredStories })
   } catch (error) {
      res.status(500).json({ error: true, message: error.message })
   }
})

// Start Server
app.listen(8000, () => {
   console.log('Backend server is running on port 8000')
})

module.exports = app
