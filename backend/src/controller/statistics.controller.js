const statisticsService = require("../service/statistics.service");

const getStatisticDateRange = async () => {
	const data = await statisticsService.getStatisticDateRange();
	return data;
};

const getMonthlyStatisticsData = async (query) => {
	const data = await statisticsService.getMonthlyStatisticsData(query);
	return data;
};

exports.statisticsController = {
	getStatisticDateRange,
	getMonthlyStatisticsData,
};
