const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./config/logger");
const AirQualityModel = require("./models/AirQuality");
const moment = require("moment-timezone");
const { getData } = require("./helper/getData");
const webpush = require("web-push");
const config = require("./config/config");
const { captureScreenshot } = require("./puppeteer/puppeteer");
const { calcAQI } = require("./helper/calculateTotalAQI");

const start = async () => {
	const app = express();

	webpush.setVapidDetails(
		"mailto:nguyenduckhai8101@gmail.com",
		config.vapidPublicKey,
		config.vapidPrivateKey
	);

	// set security HTTP headers
	app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

	// parse json request body
	app.use(express.json());

	// parse urlencoded request body
	app.use(express.urlencoded({ extended: true }));

	app.use(cors());
	app.options("*", cors());

	return app;
};

const apiRoutes = (app, io, mqtt) => {
	app.get("/", async (req, res) => {
		// await captureScreenshot();
		res.status(200).json({ data: "oke" });
	});

	app.post("/aqi", async (req, res) => {
		/**
		 	req.body: [
				{
					co:,
					o3:,
					tvoc:
					pm25:
					pm10:
					so2:
					no2:
				}, 
				{
					co:,
					o3:,
					tvoc:
					pm25:
					pm10:
					so2:
					no2:
				}
			]
		*/

		var aqiIndex = await calcAQI(req.body);
		await res.status(200).json({ data: aqiIndex });
	});

	app.post("/", (req, res) => {
		res.status(200).json({ data: "oke" });
	});

	app.post("/chart", (req, res) => {
		const { labelList, aqiList } = req.body;

		io.emit("update-chart", {
			labels: labelList,
			datas: aqiList,
			aqi: aqiList[aqiList.length - 1],
		});

		res.status(200).json({ message: "Update chart success!" });
	});

	// Test webpush notification
	app.post("/webpush/subscribe", (req, res) => {
		try {
			var { subscription } = req.body;

			const payload = JSON.stringify({
				title: "Risks to air quality near where you live.",
				body: "We have recorded that the air index is at a level that can be harmful to your health!",
				icon: "https://res.cloudinary.com/dv1jbd8mq/image/upload/v1697540735/fxan8fhvg4qdsi8rkvrb.png",
			});

			subscription = JSON.parse(subscription);

			logger.info(
				`Receive webpush subscription: ${JSON.stringify(subscription)}`
			);

			webpush
				.sendNotification(subscription, payload)
				.catch((error) => console.error(error));
		} catch (error) {
			console.log(error);
		}
	});
};

module.exports = {
	start,
	apiRoutes,
};
