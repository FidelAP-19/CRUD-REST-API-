require('dotenv').config()
const express = require('express')
const db = require('./queries')

const app = express()
const port = process.env.PORT || 3000

// Built-in Express middleware — body-parser package is no longer needed
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//CORS Middleware
const cors = require('cors')
app.use(cors())

// Routes
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and PostgreSQL API' })
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

// Global error-handling middleware — must be registered last
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message)
  res.status(500).send('Internal Server Error')
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})