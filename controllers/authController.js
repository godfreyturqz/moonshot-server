// LIBRARIES
const bcrypt = require('bcrypt')
// MODEL
const UserModel = require('../models/userModel')
// UTILS
const jwt = require('../utils/jwt')
const signupErrorHandler = require('../utils/signupErrorHandler')


const JWT_COOKIE_NAME = 'JWT'

//------------------------------------
// SIGNUP
//------------------------------------
module.exports.signupUser = async (req,res) => {

    const { email, password } = req.body

    try {
        const userData = await UserModel.create({ email, password })
        const accessToken = jwt.generateAccessToken(userData._id)
        const refreshToken = jwt.generateRefreshToken(userData._id)

        // Saving refreshToken with current user
        userData.refreshToken = refreshToken
        const result = await userData.save()
        console.log(result)

        res.cookie(JWT_COOKIE_NAME, refreshToken, { 
            httpOnly:true, 
            maxAge: 1 * 24 * 60 * 60 * 1000,
            sameSite: 'None',
            // secure: true // only add when in production
        })

        res.status(201).json({ accessToken })

    } catch (error) {
        const errors = signupErrorHandler(error)
        res.status(400).json({ message: 'user not created', errors })
    }
}

//------------------------------------
// SIGNIN
//------------------------------------
module.exports.signinUser = async (req,res) => {

    const { email, password } = req.body
    
    if(!email || !password) return res.status(400).json({ message: 'email and password are required.' })

    try {
        const userData = await UserModel.findOne({ email })
        if(!userData) return res.status(404).json({ message: 'account does not exists' })

        const isMatch = await bcrypt.compare(password, userData.password)
        if(!isMatch) return res.status(401).json({message: 'authentication error'})
    
        const accessToken = jwt.generateAccessToken(userData._id)
        const refreshToken = jwt.generateRefreshToken(userData._id)

        // Saving refreshToken with current user
        userData.refreshToken = refreshToken
        userData.save()

        res.cookie(JWT_COOKIE_NAME, refreshToken, { 
            httpOnly: true,
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'None',
            // secure: true // only add when in production
        })
        res.status(200).json({accessToken}) 

    } catch (error) {
        res.status(400).json({message: 'login failed', error})
    }
}

//------------------------------------
// SIGNOUT
//------------------------------------
module.exports.signoutUser = (req, res) => {
    res.cookie(JWT_COOKIE_NAME, '', { httpOnly:true, maxAge: 1}).send()
}

//------------------------------------
// FOR DEV PURPOSES
//------------------------------------

// GET ALL USERS
module.exports.getAllUsers = async (req,res) => {
    const data = await UserModel.find()
    res.json(data)
}

// DELETE ALL USERS
module.exports.deleteAllUsers = (req, res) => {
    UserModel.deleteMany({}).then((res)=> res.json('success'))
    .catch(err => res.json(err))
}