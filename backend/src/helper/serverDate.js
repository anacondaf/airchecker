const logger = require("../config/logger");

//tzDifference default for vn dateTime
const mapServerTimeToVnTime = (tzDifference = -420) => {
	const serverToday = new Date(Date.now());

	logger.info(`serverToday | ${serverToday}`);

	var offsetToday = new Date(serverToday.getTime() - tzDifference * 60 * 1000);

	logger.info(`offsetToday | ${offsetToday}`);

	return {
		serverToday,
		offsetToday,
	};
};

module.exports = {
	mapServerTimeToVnTime,
};
