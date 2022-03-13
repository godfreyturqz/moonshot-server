// LIBRARIES
const bcrypt = require('bcrypt')
// MODEL
const userModel = require('../models/userModel')
// UTILS
const jwt = require('../utils/jwt')
const signupErrorHandler = require('../utils/signupErrorHandler')


const JWT_COOKIE_NAME = 'JWT'

//------------------------------------
// SIGNUP
//------------------------------------
module.exports.signupUser = async (req,res) => {

    try {
        const userData = await userModel.create(req.body)
        const token = jwt.createToken(userData._id)

        res.cookie(JWT_COOKIE_NAME, token, { 
            httpOnly:true, maxAge: 3 * 24 * 60 * 60 * 1000,
            // secure: true // only add when in production
        })
        res.status(201).json({ userId: userData._id })

    } catch (error) {
        const errors = signupErrorHandler(error)
        res.status(400).json({ message: 'user not created', errors })
    }
}

//------------------------------------
// LOGIN
//------------------------------------
module.exports.loginUser = async (req,res) => {
    
    try {
        const userData = await userModel.findOne({ email: req.body.email })
        if(userData === null) return res.status(400).json({ email: 'account does not exists' })

        const isAuth = await bcrypt.compare(req.body.password, userData.password)

        if(isAuth) {

            const token = jwt.createToken(userData._id)
            res.cookie(JWT_COOKIE_NAME, token, { httpOnly:true, maxAge: 3 * 24 * 60 * 60 * 1000})
            res.status(200).json({userId: userData._id}) 

        } else {
            res.status(400).json({password: 'authentication error'})
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'login failed', error })
    }
}

//------------------------------------
// LOGOUT
//------------------------------------
module.exports.logoutUser = (req, res) => {
    res.cookie(JWT_COOKIE_NAME, '', { httpOnly:true, maxAge: 1}).send()
}

//------------------------------------
// FOR DEV PURPOSES
//------------------------------------

// GET ALL USERS
module.exports.getAllUsers = async (req,res) => {
    const data = await userModel.find()
    res.json(data)
}

// DELETE ALL USERS
module.exports.deleteAllUsers = (req, res) => {
    userModel.deleteMany({}).then((res)=> res.json('success'))
    .catch(err => res.json(err))
}