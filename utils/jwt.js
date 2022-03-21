const jwt = require('jsonwebtoken')

//------------------------------------
// GENERATE TOKENS
//------------------------------------
module.exports.generateAccessToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.ACCESS_TOKEN, 
        { expiresIn: '30s' } // 30 seconds
    )
}

module.exports.generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.REFRESH_TOKEN, 
        { expiresIn: 1 * 24 * 60 * 60 } // 1 day
    )
}