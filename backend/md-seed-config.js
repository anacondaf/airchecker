const mongoose = require("mongoose");
const config = require("./src/config/config");

// Import seeders list
const PollutantSeeder = require("./src/seeders/pollutants.seeder");
const AQISeeder = require("./src/seeders/aqi.seeder");

const mongoURL = config.mongoose.url;

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
const seedersList = {
	PollutantSeeder,
	AQISeeder,
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
const connect = async () =>
	await mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
const dropdb = async () => {
	console.log("Don't Drop DB");
};

module.exports = {
	seedersList,
	connect,
	dropdb,
};
