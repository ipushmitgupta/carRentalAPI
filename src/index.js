require('dotenv').config()
let express = require('express')
let app = express()
let addCarRoute = require('./routes/addNewCar');
let bookCarRoute = require('./routes/bookSpecificModel')
let homeRoute = require('./routes/home')
//let path = require('path')
let bodyParser = require('body-parser')
let db = require('./database')

app.use(bodyParser.json())

app.use(express.static('public'))

app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
  next()
})

app.use(homeRoute)
app.use(addCarRoute)
app.use(bookCarRoute)

// Handler for 404 - Resource Not Found
app.use((req, res, next) => {
  res.status(404).send('We think you are lost!')
})

// Handler for Error 500
app.use((err, req, res, next) => {
  console.error(err.stack)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.info(`Server has started on ${PORT}`))