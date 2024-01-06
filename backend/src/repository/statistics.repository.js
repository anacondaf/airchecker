const AirQualityModel = require("../models/AirQuality");

const getDateTimeRange = async () => {
	const fromDate = await AirQualityModel.find()
		.sort({ createdAt: 1 })
		.limit(1)
		.select(`createdAt`);

	const toDate = await AirQualityModel.find()
		.sort({ createdAt: -1 })
		.limit(1)
		.select(`createdAt`);

	return {
		from: fromDate,
		to: toDate,
	};
};

const getStatisticsDataByYear = async (year) => {
	let query = {
		$expr: {
			$eq: [{ $year: "$createdAt" }, year],
		},
	};

	const pollutionDatas = await AirQualityModel.find(query);

	return pollutionDatas;
};

module.exports = { getDateTimeRange, getStatisticsDataByYear };
