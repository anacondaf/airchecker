const puppeteer = require("puppeteer");
const path = require("path");
const logger = require("../config/logger");

async function captureScreenshot() {
	const targetUrl = "https://www.airchecker.online";
	const storageLocation = `../assets/${Date.now()}.png`;

	try {
		// Launch headless Chromium browser
		const browser = await puppeteer.launch({ headless: false });

		// Create a new page
		const page = await browser.newPage();

		// Set viewport width and height
		await page.setViewport({ width: 1440, height: 1080 });

		// Navigate to the target URL
		await page.goto(targetUrl);

		await page.waitForSelector(".air-info"); // wait for the selector to load
		const element = await page.$(".air-info"); // declare a variable with an ElementHandle
		console.log(element);

		// Need to wait for the website to get full data
		setTimeout(async () => {
			await element.screenshot({ path: path.join(__dirname, storageLocation) });
			await browser.close();

			logger.info("🎉 Screenshot captured successfully.");
		}, 8000);
	} catch (err) {
		logger.error(`❌ Error: ${err.message}`);
	}
}

module.exports = {
	captureScreenshot,
};
