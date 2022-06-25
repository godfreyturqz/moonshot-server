const fs = require('fs')

module.exports = ({ filePathAbsolute }) => {
	return new Promise((resolve, reject) => {
		fs.unlink(filePathAbsolute, (err) => {
			if (err) reject(err)
			resolve(filePathAbsolute)
		})
	})
}
