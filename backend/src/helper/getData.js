const { reverse } = require("dns");
const AirQualityModel = require("../models/AirQuality");

const getData = async () => {
	const tzDifference = -420; //region vn timeoffset

	const serverToday = new Date(Date.now());
	var offsetToday = new Date(serverToday.getTime() - tzDifference * 60 * 1000);

	var offsetNextDay = new Date(offsetToday.getTime() + 24 * 3600 * 1000)
		.toISOString()
		.replace(/T(.+)/g, "T00:00:00.000Z");

	const docs = await AirQualityModel.aggregate([
		{
			$match: {
				createdAt: {
					$gte: {
						$date: offsetToday
							.toISOString()
							.replace(/T(.+)/g, "T00:00:00.000Z"),
					},
					$lt: {
						$date: offsetNextDay,
					},
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

	aqis = docs[0]["aqi"].reverse();
	humidity = docs[0]["humidity"][0];
	temperature = docs[0]["temperature"][0];
	co = docs[0]["co"][0];

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
};

module.exports.getData = getData;
