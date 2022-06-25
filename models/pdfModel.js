const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pdfSchema = new Schema({
	uid: { type: String },
	filePathAbsolute: { type: String },
})

module.exports = mongoose.model('pdf', pdfSchema)
