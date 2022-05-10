// LIBRARIES
const bcrypt = require('bcrypt')
// MODEL
const UserModel = require('../models/userModel')
// UTILS
const {
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
} = require('../utils/jwt')
const signupErrorHandler = require('../utils/signupErrorHandler')
// CONSTANTS
const JWT_COOKIE_NAME = 'refreshToken'

//------------------------------------
// CONFIG
//------------------------------------

const cookieConfig = {
	httpOnly: true,
	maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
	sameSite: 'None',
	// secure: true, // will not work with Postman if set to false
}

//------------------------------------
// SIGNUP
//------------------------------------
module.exports.signupUser = async (req, res) => {
	try {
		const { email, password } = req.body
		// encrypt the password
		const hashedPassword = await bcrypt.hash(password, 10)

		const userData = await UserModel.create({ email, password: hashedPassword })

		// generate access token and refresh token
		const accessToken = generateAccessToken({ _id: userData?._id })
		const refreshToken = generateRefreshToken({ _id: userData?._id })

		// save refreshToken to database
		userData.refreshToken = refreshToken
		await userData.save()

		res.cookie(JWT_COOKIE_NAME, refreshToken, cookieConfig)

		res.status(201).json({ accessToken })
	} catch (error) {
		const errors = signupErrorHandler(error)
		res.status(400).json({ message: 'user not created', errors })
	}
}

//------------------------------------
// SIGNIN
//------------------------------------
module.exports.signinUser = async (req, res) => {
	try {
		// check required field
		const { email, password } = req.body
		if (!email || !password)
			return res
				.status(400)
				.json({ message: 'email and password are required.' })

		// check existing
		const userData = await UserModel.findOne({ email })
		if (!userData)
			return res.status(404).json({ message: 'account does not exists' })

		// compare password
		const isMatch = await bcrypt.compare(password, userData?.password)
		if (!isMatch)
			return res.status(401).json({ message: 'authentication error' })

		// generate access token and refresh token
		const accessToken = generateAccessToken({ _id: userData?._id })
		const refreshToken = generateRefreshToken({ _id: userData?._id })

		// save refreshToken to database
		userData.refreshToken = refreshToken
		await userData.save()

		res.cookie(JWT_COOKIE_NAME, refreshToken, cookieConfig)

		res.status(200).json({ accessToken })
	} catch (error) {
		res.status(401).json({ message: 'signin failed', error })
	}
}

//------------------------------------
// REFRESH TOKEN
//------------------------------------
module.exports.refreshToken = async (req, res) => {
	try {
		const cookies = req.cookies
		if (!cookies[JWT_COOKIE_NAME])
			return res.status(401).json({ message: 'no refresh token' })

		const refreshToken = cookies[JWT_COOKIE_NAME]
		const userData = await UserModel.findOne({ refreshToken })
		if (!userData)
			return res.status(403).json({ message: 'refresh token does not exists' })

		// verify jwt
		const decoded = verifyRefreshToken(refreshToken)
		if (decoded._id !== userData._id.toString())
			return res.status(403).json({ message: 'not verified' })

		const accessToken = jwt.generateAccessToken({ _id: userData?._id })
		res.status(200).json({ accessToken })
	} catch (error) {
		res.status(403).json({ message: 'refresh token invalid or expired' })
	}
}

//------------------------------------
// SIGNOUT
//------------------------------------
module.exports.signoutUser = (req, res) => {
	res.cookie(JWT_COOKIE_NAME, '', { httpOnly: true, maxAge: 1 }).send()
}

//X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X
// FOR DEV PURPOSES
//X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X

// GET ALL USERS
module.exports.getAllUsers = async (req, res) => {
	const data = await UserModel.find()
	res.json(data)
}

// DELETE ALL USERS
module.exports.deleteAllUsers = (req, res) => {
	UserModel.deleteMany({})
		.then((res) => res.json('success'))
		.catch((err) => res.json(err))
}
