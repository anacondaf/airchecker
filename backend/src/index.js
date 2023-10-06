const http = require("http");
const mongoose = require("mongoose");
const { start, apiRoutes } = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const socketio = require("./websocket/socketio");
const mqtt = require("./mqtt/mqtt");

let server;

mongoose
	.connect(config.mongoose.url, config.mongoose.options)
	.then(async () => {
		try {
			logger.info("Connected to MongoDB");

			// migration
			// await migrate();

			app = await start();
			const httpServer = http.createServer(app);

			var { message, io } = await socketio(httpServer);
			logger.info(message);

			var { message, client } = await mqtt(io);
			logger.info(message);

			apiRoutes(app, io, client);

			server = httpServer.listen(config.port, () => {
				logger.info(`Listening to port ${config.port}`);
			});
		} catch (error) {
			logger.error(error.message);
		}
	});

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
