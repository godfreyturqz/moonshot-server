const router = require('express').Router()
const authController = require('../controllers/authController')


router.route('/signup')
    .post(authController.signupUser)

router.route('/signin')
    .post(authController.signinUser)

router.route('/signout')
    .get(authController.signoutUser)

// for dev purposes
router.route('/authDev')
    .get(authController.getAllUsers)
    .delete(authController.deleteAllUsers)

module.exports = router