// MODELS
const recordModel = require('../models/recordModel')
const pdfModel = require('../models/pdfModel')
// UTILS
const generatePdf = require('../utils/generatePdf')
const deleteFile = require('../utils/deleteFile')

// CONFIG
const URL = 'http://localhost:3000/record-details'
const SAVE_LOCATION = 'C:/data/moonshot'
const FILE_TYPE = 'pdf'

// API ROUTE
// http://localhost:5000/api/v1/pdf/:id

module.exports.create = async (req, res) => {
	try {
		const data = await recordModel.findOne({ uid: req.params.id }).lean()
		if (!data) return res.status(404).json('File not found: ' + req.params.id)

		// Saved location including filename
		const filePathAbsolute = `${SAVE_LOCATION}/${data.firstName} ${data.lastName} ${data.uid}.${FILE_TYPE}`

		// generate PDF
		await generatePdf({
			url: `${URL}/${data.uid}`,
			filePathAbsolute,
			format: 'legal',
		})

		// save in database
		const response = await pdfModel.create({
			uid: req.params.id,
			filePathAbsolute,
		})

		// add 'pdfModel' reference to 'recordModel'
		await recordModel.findOneAndUpdate(
			{ uid: req.params.id },
			{ pdfDoc: response },
			{ new: true }
		)

		res.status(200).json('File created: ' + response)
	} catch (error) {
		res.status(400).json({
			errorCode: error.code,
			errorMessage: error.message,
			error,
		})
	}
}

module.exports.remove = async (req, res) => {
	try {
		const data = await recordModel.findOne({ uid: req.params.id }).lean()

		if (data) {
			// Saved location including filename
			const filePathAbsolute = `${SAVE_LOCATION}/${data.firstName} ${data.lastName} ${data.uid}.${FILE_TYPE}`

			try {
				const response = await deleteFile({
					filePathAbsolute,
				})
				return res.status(200).json('File deleted: ' + response)
			} catch (error) {
				return res.status(400).json({
					errorCode: error.code,
					errorMessage: error.message,
					error,
				})
			}
		}

		res.status(404).json('File not found: ' + req.params.id)
	} catch (error) {
		res.status(400).json({
			errorCode: error.code,
			errorMessage: error.message,
			error,
		})
	}
}
