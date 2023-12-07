const analyticsService = require("../service/analytics.service");

const getPollutantDatas = async (query) => {
	const data = await analyticsService.getPollutantDatas(query);
	return data;
};

exports.analyticsController = {
	getPollutantDatas,
};
