const router = require('express').Router()
const recordController = require('../controllers/recordController')

router.route('/record').get(recordController.get).post(recordController.create)

router
	.route('/record/:id')
	.get(recordController.getOne)
	.delete(recordController.remove)
	.put(recordController.update)

module.exports = router
