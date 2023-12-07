const analyticsRepository = require("../repository/analytics.repository");
const logger = require("../config/logger");

const getPollutantDatas = async ({ type, from, to }) => {
	if (from == "null" || to == "null") {
		logger.info("from or to value is null. Return empty array");
		return [];
	}

	logger.info(`Get pollutant data of ${type} from ${from} to ${to}`);

	var queryResults =
		await analyticsRepository.findPollutantWithTypeAndDateRange(type, from, to);

	return queryResults;
};

module.exports = {
	getPollutantDatas,
};
