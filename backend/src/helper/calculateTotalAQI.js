const PollutantScaleModel = require("../models/PollutantScale");
const logger = require("../config/logger");

const customRound = (value) => {
	// Check if the decimal part is greater than or equal to 0.5
	if (value % 1 >= 0.5) {
		return Math.ceil(value);
	} else {
		return Math.floor(value);
	}
};

const subIndexFormula = (
	aqiLo,
	aqiHi,
	pollutantLo,
	pollutantHi,
	concentration
) => {
	var result =
		[(aqiHi - aqiLo) / (pollutantHi - pollutantLo)] *
			(concentration - pollutantLo) +
		aqiLo;

	return result;
};

const calcPollutantAQI = async (pollutants) => {
	let aqiDatas = [];

	for (const pollutant of pollutants) {
		let aqiResult = {
			pollutantsAqi: {},
		};

		for (const [name, concentration] of Object.entries(pollutant)) {
			let pollutantAqiScale = await PollutantScaleModel.aggregate([
				{
					$match: {
						name: {
							$eq: `${name}`,
						},
						min: {
							$lte: concentration,
						},
						max: {
							$gte: concentration,
						},
					},
				},
				{
					$lookup: {
						from: "aqi_scale",
						localField: "category",
						foreignField: "category",
						as: "aqi_scale",
					},
				},
				{
					$unwind: "$aqi_scale",
				},
				{
					$project: {
						name: 1,
						unit: 1,
						min: 1,
						max: 1,
						category: 1,
						aqi_scale: {
							min: 1,
							max: 1,
						},
					},
				},
			]).exec();

			pollutantAqiScale = pollutantAqiScale[0];

			logger.info(
				`name: ${pollutantAqiScale.name} | aqiLo: ${pollutantAqiScale.aqi_scale.min} | aqiHi: ${pollutantAqiScale.aqi_scale.max} | pollutantLo: ${pollutantAqiScale.min} | pollutantHi: ${pollutantAqiScale.max} | concentration: ${concentration}`
			);

			const subIndex = subIndexFormula(
				pollutantAqiScale.aqi_scale.min,
				pollutantAqiScale.aqi_scale.max,
				pollutantAqiScale.min,
				pollutantAqiScale.max,
				concentration
			);

			aqiResult.pollutantsAqi[name] = customRound(subIndex);

			logger.info(`Sub-Index: ${subIndex}`);
		}

		aqiDatas.push(aqiResult);
	}

	return aqiDatas;
};

/**
 * @param {Object} pollutants
 */

const calcAQI = async (pollutants) => {
	let aqiDatas = [];

	for (const pollutant of pollutants) {
		let maxAqiValue;

		let aqiResult = {
			maxAqiValue,
			pollutantsAqi: {},
		};

		for (const [name, concentration] of Object.entries(pollutant)) {
			let pollutantAqiScale = await PollutantScaleModel.aggregate([
				{
					$match: {
						name: {
							$eq: `${name}`,
						},
						min: {
							$lte: concentration,
						},
						max: {
							$gte: concentration,
						},
					},
				},
				{
					$lookup: {
						from: "aqi_scale",
						localField: "category",
						foreignField: "category",
						as: "aqi_scale",
					},
				},
				{
					$unwind: "$aqi_scale",
				},
				{
					$project: {
						name: 1,
						unit: 1,
						min: 1,
						max: 1,
						category: 1,
						aqi_scale: {
							min: 1,
							max: 1,
						},
					},
				},
			]).exec();

			pollutantAqiScale = pollutantAqiScale[0];

			logger.info(
				`name: ${pollutantAqiScale.name} | aqiLo: ${pollutantAqiScale.aqi_scale.min} | aqiHi: ${pollutantAqiScale.aqi_scale.max} | pollutantLo: ${pollutantAqiScale.min} | pollutantHi: ${pollutantAqiScale.max} | concentration: ${concentration}`
			);

			const subIndex = subIndexFormula(
				pollutantAqiScale.aqi_scale.min,
				pollutantAqiScale.aqi_scale.max,
				pollutantAqiScale.min,
				pollutantAqiScale.max,
				concentration
			);

			aqiResult.pollutantsAqi[name] = customRound(subIndex);

			logger.info(`Sub-Index: ${subIndex}`);

			if (!maxAqiValue) {
				maxAqiValue = subIndex;
				continue;
			}

			if (maxAqiValue < subIndex) {
				maxAqiValue = subIndex;
			}
		}

		aqiResult["maxAqiValue"] = customRound(maxAqiValue);

		aqiDatas.push(aqiResult);
	}

	return aqiDatas;
};

module.exports = {
	calcAQI,
	calcPollutantAQI,
};
