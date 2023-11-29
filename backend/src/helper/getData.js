const AirQualityModel = require("../models/AirQuality");
const logger = require("../config/logger");
const moment = require("moment");
const { calcCompositeAQI } = require("./calculateTotalAQI");
const { mapServerTimeToVnTime } = require("./serverDate");

const getData = async () => {
	const { offsetToday, serverToday } = mapServerTimeToVnTime();

	var offsetNextDay = new Date(offsetToday.getTime() + 24 * 3600 * 1000)
		.toISOString()
		.replace(/T(.+)/g, "T00:00:00.000Z");

	logger.info(`offsetNextDay | ${offsetNextDay}`);

	const gmt7Offset = 7 * 60 * 60 * 1000;
	const docs = await AirQualityModel.aggregate([
		{
			$addFields: {
				// Convert the createdAt field to GMT+7 by adding the offset
				createdAtGMT7: {
					$add: ["$createdAt", gmt7Offset],
				},
			},
		},
		{
			$match: {
				createdAtGMT7: {
					$gte: new Date(
						offsetToday.toISOString().replace(/T(.+)/g, "T00:00:00.000Z")
					),
					$lt: new Date(offsetNextDay),
				},
			},
		},
		{ $sort: { createdAt: -1 } },
		{ $limit: 10 },
		{
			$project: {
				_id: 1,
				aqi: 1,
				humidity: 1,
				temperature: 1,
				co: 1,
				co2: 1,
				tvoc: 1,
				o3: 1,
				pm25: 1,
				calc_aqi: 1,
				createdAt: "$createdAtGMT7",
			},
		},
		{
			$group: {
				_id: null,
				aqi: { $push: "$aqi" },
				humidity: { $push: "$humidity" },
				temperature: { $push: "$temperature" },
				co: { $push: "$co" },
				co2: { $push: "$co2" },
				tvoc: { $push: "$tvoc" },
				o3: { $push: "$o3" },
				pm25: { $push: "$pm25" },
				calc_aqi: { $push: "$calc_aqi" },
				createdAt: { $push: "$createdAt" },
			},
		},
	]).exec();

	logger.info(`Data queried from database: \n 🚀${JSON.stringify(docs)}`);

	if (docs.length > 0) {
		const aqis = docs[0]["calc_aqi"].reverse();
		const humidity = docs[0]["humidity"][0];
		const temperature = docs[0]["temperature"][0];
		const co = docs[0]["co"][0];
		const co2 = docs[0]["co2"][0];
		const tvoc = docs[0]["tvoc"][0];
		const o3 = docs[0]["o3"][0];
		const pm25 = docs[0]["pm25"][0];
		const calc_aqi = docs[0]["calc_aqi"][0];

		// CreatedAt is applied offset time
		docs[0]["createdAt"] = docs[0]["createdAt"].reverse();

		let latestCreatedAt = docs[0]["createdAt"].pop();

		latestCreatedAt = moment(latestCreatedAt).subtract(420, "minutes");

		docs[0]["createdAt"] = docs[0]["createdAt"].map((x) => {
			return moment(x).format("HH:mm");
		});

		return {
			labels: docs[0]["createdAt"],
			aqi: aqis.pop(),
			datas: aqis,
			humidity,
			temperature,
			co,
			co2,
			tvoc,
			o3,
			pm25,
			calc_aqi,
			latestCreatedAt,
		};
	}

	return {
		labels: [],
		aqi: null,
		datas: [],
		humidity: null,
		temperature: null,
		co: null,
		co2: null,
		tvoc: null,
		o3: null,
		pm25: null,
		calc_aqi: null,
	};
};

module.exports.getData = getData;
