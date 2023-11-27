const analyticsRepository = require("../repository/analytics.repository");

const getPollutantDatas = async ({ type, from, to }) => {
	var queryResults =
		await analyticsRepository.findPollutantWithTypeAndDateRange(type, from, to);

	return queryResults;
};

module.exports = {
	getPollutantDatas,
};
