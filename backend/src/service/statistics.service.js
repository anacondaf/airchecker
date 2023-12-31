const statisticsRepository = require("../repository/statistics.repository");
const logger = require("../config/logger");

const AirQualityModel = require("../models/AirQuality");

const getStatisticDateRange = async () => {
	var queryResults = await statisticsRepository.getDateTimeRange();

	return queryResults;
};

const getMonthlyStatisticsData = async ({ year }) => {
	const queryResults = await AirQualityModel.find({
		createdAt: {
			$gte: new Date(`${year}-01-01T00:00:00Z`),
			$lte: new Date(`${year}-12-31T16:59:59Z`),
		},
	});

	const monthMap = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const groupedByMonth = monthMap.reduce((acc, _, i) => {
		acc[i] = [];
		return acc;
	}, {});

	queryResults.forEach((item) => {
		const date = new Date(item.createdAt);
		const month = date.getMonth();
		groupedByMonth[month].push(item.calc_aqi ?? item.aqi);
	});

	const averageAqiByMonth = Object.entries(groupedByMonth).map(
		([month, aqiValues]) => {
			let avg = 0;
			if (aqiValues.length > 0) {
				const sum = aqiValues.reduce((a, b) => a + b, 0);
				avg = sum / aqiValues.length;
			}

			return {
				month: monthMap[parseInt(month)],
				averageAqi: avg,
			};
		}
	);

	return averageAqiByMonth;
};

const getSeasonStatisticsData = async ({ year }) => {
	const seasons = {
		Spring: [],
		Summer: [],
		Autumn: [],
		Winter: [],
	};
	let stats = {};

	let query = {
		$expr: {
			$eq: [{ $year: "$createdAt" }, year],
		},
	};

	const queryResults = await AirQualityModel.find(query);

	queryResults.forEach((item) => {
		var date = new Date(item.createdAt);

		const month = date.getMonth() + 1;

		const aqiVal = item.calc_aqi ?? item.aqi;

		if (month >= 3 && month <= 5) {
			seasons["Spring"].push(aqiVal);
		} else if (month >= 6 && month <= 8) {
			seasons["Summer"].push(aqiVal);
		} else if (month >= 9 && month <= 11) {
			seasons["Autumn"].push(aqiVal);
		} else {
			seasons["Winter"].push(aqiVal);
		}
	});

	const totalAqi = Object.values(seasons)
		.flat()
		.reduce((a, b) => a + b, 0);

	for (const season in seasons) {
		const seasonAqi = seasons[season].reduce((a, b) => a + b, 0);
		stats[season] = `${((seasonAqi / totalAqi) * 100).toFixed(2)}%`;
	}

	return stats;
};

const getAvgMonthlyPollutant = async ({ year }) => {
	let monthlyAvg = [];

	const monthMap = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	for (let month = 0; month < 12; month++) {
		const startOfMonth = new Date(year, month, 1);
		const endOfMonth = new Date(year, month + 1, 0);

		const queryResults = await AirQualityModel.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startOfMonth,
						$lte: endOfMonth,
					},
				},
			},
			{
				$group: {
					_id: null,
					avgCO: { $avg: "$co" },
					avgO3: { $avg: "$o3" },
					avgTVOC: { $avg: "$tvoc" },
					avgPM25: { $avg: "$pm25" },
				},
			},
			{
				$project: {
					_id: 0,
					avgCO: { $convert: { input: "$avgCO", to: "double" } },
					avgO3: { $convert: { input: "$avgO3", to: "double" } },
					avgTVOC: { $convert: { input: "$avgTVOC", to: "double" } },
					avgPM25: { $convert: { input: "$avgPM25", to: "double" } },
				},
			},
		]);

		monthlyAvg.push({
			month: monthMap[startOfMonth.getMonth()],
			data: queryResults[0] ?? {},
		});
	}

	return monthlyAvg;
};

const getTop3PollutedMonths = async ({ qty = 3, year }) => {
	const monthMap = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const result = await AirQualityModel.aggregate([
		{
			$match: {
				createdAt: {
					$gte: new Date(`${year}-01-01T00:00:00Z`),
					$lte: new Date(`${year}-12-31T16:59:59Z`),
				},
			},
		},
		{
			$addFields: {
				aqiValue: {
					$cond: {
						if: { $ifNull: ["$calc_aqi", false] },
						then: "$calc_aqi",
						else: "$aqi",
					},
				},
			},
		},
		{
			$group: {
				_id: { month: { $month: "$createdAt" } },
				maxAqi: { $max: "$calc_aqi" },
			},
		},
		{ $sort: { maxAqi: -1 } },
		{ $limit: parseInt(qty) },
	]);

	result.forEach((item) => {
		item._id.month = monthMap[item._id.month - 1];
		item.maxAqi = parseInt(item.maxAqi);
	});

	return result;
};

module.exports = {
	getStatisticDateRange,
	getMonthlyStatisticsData,
	getSeasonStatisticsData,
	getAvgMonthlyPollutant,
	getTop3PollutedMonths,
};
