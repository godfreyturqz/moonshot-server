require('dotenv/config')
const express = require('express')
const mongoose = require('mongoose')

const middlewares = require('./utils/middlewares')

const app = express()
//--------------------------------------------------------------
// MIDDLEWARES
//--------------------------------------------------------------
app.use(...middlewares)

//--------------------------------------------------------------
// DATABASE CONNECTION
//--------------------------------------------------------------
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.DB_CONNECTION_LOCAL)
.then(app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
.catch(error => console.log(error.message))

//--------------------------------------------------------------
// ROUTES
//--------------------------------------------------------------
app.use('/api/v1', require('./routes/record'))
app.use('/api/v1', require('./routes/auth'))
