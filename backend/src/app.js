const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const logger = require("./config/logger");
const config = require("./config/config");
const http = require("http");
const socketio = require("./websocket/socketio");
const mqtt = require("./mqtt/mqtt");

const { db } = require("./database");

let server;
let mqttClient;

const startServer = async () => {
	const app = express();

	// set security HTTP headers
	app.use(helmet());

	// parse json request body
	app.use(express.json());

	// parse urlencoded request body
	app.use(express.urlencoded({ extended: true }));

	// gzip compression
	app.use(compression());

	// enable cors
	app.use(cors());
	app.options("*", cors());

	app.use((req, res, next) => {
		// For example, a GET request to `/test` will print "GET /test"
		logger.info(`${req.method} ${req.url}`);

		next();
	});

	db();

	const httpServer = http.createServer(app);
	var { message, io } = await socketio(httpServer);
	logger.info(message);

	var { message, client } = await mqtt(io);
	logger.info(message);

	mqttClient = client;

	app.post("/", (req, res) => {
		res.status(200).json({ data: "oke" });
	});

	app.get("/airchecker", (req, res) => {
		mqttClient.publish(
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

	server = httpServer.listen(config.port, () => {
		logger.info(`Listening to port ${config.port}`);
	});
};

startServer();

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}

	// Callback for disconnection
	mqttClient.end(false, {}, () => {
		console.log("MQTTClient disconnected");
	});
};

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	logger.info("SIGTERM received");
	if (server) {
		server.close();
	}
});
