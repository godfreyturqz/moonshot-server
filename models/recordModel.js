const mongoose = require('mongoose')
const Schema = mongoose.Schema

const nameSchema = new Schema({ 
    uid: { type: String, required: true, unique: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    gender: { type: String, required: true },
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    barangay: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
})

module.exports = mongoose.model('record', nameSchema)
