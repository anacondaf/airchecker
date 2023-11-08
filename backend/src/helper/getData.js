const AirQualityModel = require("../models/AirQuality");
const logger = require("../config/logger");
const moment = require("moment");

const getData = async () => {
	const tzDifference = -420; //region vn timeoffset

	const serverToday = new Date(Date.now());

	logger.info(`serverToday | ${serverToday}`);

	var offsetToday = new Date(serverToday.getTime() - tzDifference * 60 * 1000);

	logger.info(`offsetToday | ${offsetToday}`);

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
				calc_aqi: { $push: "$calc_aqi" },
				createdAt: { $push: "$createdAt" },
			},
		},
	]).exec();

	logger.info(`Data queried from database: \n 🚀${JSON.stringify(docs)}`);

	if (docs.length > 0) {
		const aqis = docs[0]["aqi"].reverse();
		const humidity = docs[0]["humidity"][0];
		const temperature = docs[0]["temperature"][0];
		const co = docs[0]["co"][0];
		const co2 = docs[0]["co2"][0];
		const tvoc = docs[0]["tvoc"][0];
		const o3 = docs[0]["o3"][0];
		const calc_aqi = docs[0]["calc_aqi"][0];

		docs[0]["createdAt"] = docs[0]["createdAt"].reverse().map((x) => {
			return moment(x).format("HH:mm");
		});

		docs[0]["createdAt"].pop();

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
			calc_aqi,
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
		calc_aqi: null,
	};
};

module.exports.getData = getData;
