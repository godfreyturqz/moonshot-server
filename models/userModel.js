const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Enter an email'],
        unique: true,
        lowercase: [true, 'Email must be in lowercase'],
        validate: [isEmail, 'Enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    created: {
        type: Date,
        default: Date.now
    }
})

// runs a function before save
// adds salt before saving the password in the database
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    // console.log('new user is signing up...', this)
    next()
})

module.exports = mongoose.model('user', userSchema)