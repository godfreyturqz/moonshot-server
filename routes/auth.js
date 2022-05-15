const router = require('express').Router()
const authController = require('../controllers/authController')

router.route('/signup').post(authController.signUp)

router.route('/signin').post(authController.signIn)

router.route('/signout').get(authController.signOut)

router.route('/refresh').get(authController.refreshToken)

// for dev purposes
router
	.route('/authDev')
	.get(authController.getAllUsers)
	.delete(authController.deleteAllUsers)

module.exports = router
