const AirQualityModel = require("../models/AirQuality");
const logger = require("../config/logger");

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

	const docs = await AirQualityModel.aggregate([
		{
			$match: {
				createdAt: {
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
				createdAt: 1,
			},
		},
		{
			$group: {
				_id: null,
				aqi: { $push: "$aqi" },
				humidity: { $push: "$humidity" },
				temperature: { $push: "$temperature" },
				co: { $push: "$co" },
				createdAt: { $push: "$createdAt" },
			},
		},
	]).exec();

	console.log(docs);

	if (docs.length > 0) {
		const aqis = docs[0]["aqi"].reverse();
		const humidity = docs[0]["humidity"][0];
		const temperature = docs[0]["temperature"][0];
		const co = docs[0]["co"][0];

		docs[0]["createdAt"] = docs[0]["createdAt"].reverse().map((x) => {
			const d = new Date(x);
			var offsetTime = new Date(d.getTime() - tzDifference * 60 * 1000);

			return offsetTime.getHours() + ":" + offsetTime.getMinutes();
		});

		docs[0]["createdAt"].pop();

		return {
			labels: docs[0]["createdAt"],
			aqi: aqis.pop(),
			datas: aqis,
			humidity,
			temperature,
			co,
		};
	}

	return {
		labels: [],
		aqi: null,
		datas: [],
		humidity: null,
		temperature: null,
		co: null,
	};
};

module.exports.getData = getData;
