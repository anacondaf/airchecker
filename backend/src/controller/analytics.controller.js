const analyticsService = require("../service/analytics.service");

const getPollutantDatas = async (query) => {
	return await analyticsService.getPollutantDatas(query);
};

exports.analyticsController = {
	getPollutantDatas,
};
