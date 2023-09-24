var mysql = require("mysql2");
const config = require("./config/config");
const logger = require("./config/logger");

const connectMySql = () => {
	var connection = mysql.createConnection({
		host: config.host,
		port: config.dbPort,
		user: config.dbUserName,
		password: config.dbPassword,
		database: config.dbName,
	});

	connection.connect(function (err) {
		if (err) {
			logger.error("Failed to connect to MySQL: " + err.stack);

			return;
		}

		logger.info("Connect to MySQL as id: " + connection.threadId);
	});

	return connection;
};

module.exports = {
	db: connectMySql,
};
