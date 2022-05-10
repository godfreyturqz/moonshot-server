const jwt = require('jsonwebtoken')

//------------------------------------
// GENERATE TOKENS
//------------------------------------
module.exports.generateAccessToken = (payload) => {
	return jwt.sign(
		payload,
		process.env.ACCESS_TOKEN_SECRET,
		// { expiresIn: '300s' } // 15 mins
		{ expiresIn: '10s' }
	)
}

module.exports.generateRefreshToken = (payload) => {
	return jwt.sign(
		payload,
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: 1 * 24 * 60 * 60 } // 1 day
		// {expiresIn: '15s' }
	)
}

//------------------------------------
// VERIFY TOKENS
//------------------------------------
module.exports.verifyRefreshToken = (refreshToken) => {
	return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
}
