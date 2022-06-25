const router = require('express').Router()
const pdfController = require('../controllers/pdfController')

router.route('/pdf/:id').post(pdfController.create).delete(pdfController.remove)

module.exports = router
