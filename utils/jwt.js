const jwt = require('jsonwebtoken')

//------------------------------------
// GENERATE TOKENS
//------------------------------------
module.exports.generateAccessToken = (payload) => {
    return jwt.sign(
        { payload }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '30s' } // 30 seconds
        // { expiresIn: '5s' }
    )
}

module.exports.generateRefreshToken = (_id) => {
    return jwt.sign(
        { _id }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: 1 * 24 * 60 * 60 } // 1 day
        // {expiresIn: '5s' }
    )
}

//------------------------------------
// VERIFY TOKENS
//------------------------------------
module.exports.verify = (refreshToken) => {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
}