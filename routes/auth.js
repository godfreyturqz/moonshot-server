const router = require('express').Router()
const authController = require('../controllers/authController')


router.route('/signup')
    .post(authController.signupUser)

router.route('/login')
    .post(authController.loginUser)

router.route('/logout')
    .get(authController.logoutUser)

// for dev purposes
router.route('/authDev')
    .get(authController.getAllUsers)
    .delete(authController.deleteAllUsers)

module.exports = router