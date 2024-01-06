const statisticsRepository = require("../repository/statistics.repository");
const logger = require("../config/logger");

const getStatisticDateRange = async () => {
	var queryResults = await statisticsRepository.getDateTimeRange();

	return queryResults;
};

const getMonthlyStatisticsData = async ({ year }) => {
	let properties = ["humidity", "temperature", "co", "co2", "tvoc", "o3"];
	let stats = {};

	var queryResults = await statisticsRepository.getMonthlyStatisticsData(year);

	properties.forEach((property) => {
		let values = queryResults.map((item) => item[property]);
		let sum = values.reduce((a, b) => a + b, 0);
		let avg = sum / values.length;
		let min = Math.min(...values);
		let max = Math.max(...values);
		let minDate = queryResults[values.indexOf(min)].createdAt;
		let maxDate = queryResults[values.indexOf(max)].createdAt;

		stats[property] = {
			avg,
			min,
			max,
			minDate,
			maxDate,
		};
	});

	console.log(stats);

	return stats;
};

module.exports = {
	getStatisticDateRange,
	getMonthlyStatisticsData,
};
