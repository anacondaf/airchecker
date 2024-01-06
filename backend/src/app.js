const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./config/logger");
const webpush = require("web-push");
const config = require("./config/config");
const { calcAQI } = require("./helper/calculateTotalAQI");
const v1Route = require("./routes/v1");
const { errors } = require("celebrate");
const { errorHandler } = require("./middlewares/errors");
const ApiError = require("./utils/ApiError");
const httpStatus = require("http-status");

const { producer } = require("./rabbitmq/producer");

// const { redisClient } = require("./redis/redis");

const start = async (agenda) => {
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

	// Agenda jobs dashboard
	// app.use("/jobs", Agendash(agenda));

	return app;
};

const apiRoutes = (app, io, mqtt) => {
	app.use("/v1", v1Route);

	app.get("/test-cache", async (req, res, next) => {
		// const value = await redisClient.get("value");
		res.send(value);
	});

	app.post("/amqp", async (req, res, next) => {
		await producer.publishEmailMessage(req.body.mailList);
		res.send("Sent");
	});

	app.get("/", async (req, res) => {
		res.set("Content-Type", "text/html");
		res.send(
			Buffer.from(
				"<h1>AirChecker API</h1> \
                <p>A nodejs api implementation for air quality monitoring realtime."
			)
		);
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

	// send back a 404 error for any unknown api request
	app.use((req, res, next) => {
		next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
	});

	// handle error
	app.use(errorHandler);

	// celebrate error handler
	app.use(errors());
};

module.exports = {
	start,
	apiRoutes,
};
