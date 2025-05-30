const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const router = require('./src/routes/api')

const app = new express()

// MongoDB connection string
let URL = "mongodb+srv://rehad:624602@cluster0.f764rqj.mongodb.net/Task-Manager"

mongoose.connect(URL)
    .then(() => {
        console.log("Database Connected")
    })
    .catch((err) => {
        console.log(err)
    })

// Middlewares
app.use(bodyParser())
app.use(mongoSanitize())
app.use(helmet())
app.use(hpp())
app.use(cors())

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb" }))

// Rate Limiting
let Limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30000 })
app.use(Limiter)

// API routes
app.use('/api/v1', router)

// Serve React frontend (static files)
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// For client-side routing, serve index.html for all non-API requests
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'))
})

// Catch all for unknown routes (optional fallback for API calls)
app.get('*', function (req, res) {
    res.status(404).json({ status: "fail", data: "Not Found" })
})

module.exports = app;