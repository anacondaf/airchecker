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

	connection.query(
		"CREATE TABLE AirQuality (\
		id varchar(255),\
		aqi float,\
		humidity float,\
		temperature float,\
		co float,\
		measuredAt datetime);",
		function (err, results, fields) {
			if (err.code != "ER_TABLE_EXISTS_ERROR") logger.error(err);
		}
	);

	return connection;
};

module.exports = {
	db: connectMySql,
};
