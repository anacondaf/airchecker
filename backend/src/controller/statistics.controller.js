const statisticsService = require("../service/statistics.service");

const getStatisticDateRange = async () => {
	const data = await statisticsService.getStatisticDateRange();
	return data;
};

const getMonthlyStatisticsData = async (query) => {
	const data = await statisticsService.getMonthlyStatisticsData(query);
	return data;
};

const getSeasonStatisticsData = async (query) => {
	const data = await statisticsService.getSeasonStatisticsData(query);
	return data;
};

const getAvgMonthlyPollutant = async (query) => {
	const data = await statisticsService.getAvgMonthlyPollutant(query);
	return data;
};

exports.statisticsController = {
	getStatisticDateRange,
	getMonthlyStatisticsData,
	getSeasonStatisticsData,
	getAvgMonthlyPollutant,
};
