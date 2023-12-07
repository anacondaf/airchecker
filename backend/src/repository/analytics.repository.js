const AirQualityModel = require("../models/AirQuality");

const findPollutantWithTypeAndDateRange = async (type, from, to) => {
	let query = {
		createdAt: { $gte: from, $lte: to },
	};
	query[type] = { $exists: true };

	const pollutantTypeInDateRage = await AirQualityModel.find(query).select(
		`${type} createdAt`
	);
	return pollutantTypeInDateRage;
};

module.exports = { findPollutantWithTypeAndDateRange };
