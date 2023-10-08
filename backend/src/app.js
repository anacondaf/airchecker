const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./config/logger");
const AirQualityModel = require("./models/AirQuality");
const moment = require("moment-timezone");

const start = async () => {
	const app = express();

	// set security HTTP headers
	app.use(helmet());

	// parse json request body
	app.use(express.json());

	// parse urlencoded request body
	app.use(express.urlencoded({ extended: true }));

	// enable cors
	app.use(cors());
	app.options("*", cors());

	return app;
};

const apiRoutes = (app, io, mqtt) => {
	app.get("/", async (req, res) => {
		io.emit("update-chart", {
			labels: docs[0]["createdAt"],
			aqi: Math.trunc(aqis.pop()),
			datas: aqis,
			humidity: humidity,
			temperature: temperature,
			co: co,
		});

		res.status(200).json({ data: "oke" });
	});

	app.post("/", (req, res) => {
		res.status(200).json({ data: "oke" });
	});

	app.get("/airchecker", (req, res) => {
		mqtt.publish(
			"/airchecker",
			"Hello QOS1",
			{
				qos: 2,
				retain: true,
			},
			(error) => {
				if (error) {
					console.error(error);
				}
			}
		);

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
};

module.exports = {
	start,
	apiRoutes,
};
