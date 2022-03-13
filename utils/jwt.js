const jwt = require('jsonwebtoken')

//------------------------------------
// CREATE TOKENS
//------------------------------------
module.exports.createToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.ACCESS_TOKEN, 
        { expiresIn: 3 * 24 * 60 * 60 }
    )
}