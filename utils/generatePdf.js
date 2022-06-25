const puppeteer = require('puppeteer')

const DEFAULT = {
	format: 'letter',
}

module.exports = async ({ url, filePathAbsolute, format = DEFAULT.format }) => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.goto(url)
	await page.pdf({
		path: filePathAbsolute,
		format: format,
	})

	await browser.close()

	return true
}
