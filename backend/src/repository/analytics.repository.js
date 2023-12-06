const AirQualityModel = require("../models/AirQuality");

const findPollutantWithTypeAndDateRange = async (type, from, to) => {
	var fromDate = new Date(from)
		.toISOString()
		.replace(/T(.+)/g, "T00:00:00.000Z");

	var toDate = new Date(to).toISOString().replace(/T(.+)/g, "T23:59:59.000Z");

	let query = {
		createdAt: { $gte: fromDate, $lte: toDate },
	};
	query[type] = { $exists: true };

	const pollutantTypeInDateRage = await AirQualityModel.find(query).select(
		`${type} createdAt`
	);
	return pollutantTypeInDateRage;
};

module.exports = { findPollutantWithTypeAndDateRange };
