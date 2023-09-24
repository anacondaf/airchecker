const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const logger = require("./config/logger");
const config = require("./config/config");
const http = require("http");

const { db } = require("./database");

let server;

const startServer = () => {
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
