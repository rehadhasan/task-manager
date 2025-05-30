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

app.use(express.static('client/dist'))

// Add React Front End Routing
app.get('*', function (req,res) {
    res.sendFile(path.resolve(__dirname,'client', 'dist', 'index.html'))
})

module.exports = app;