const { reverse } = require("dns");
const AirQualityModel = require("../models/AirQuality");

const getData = async () => {
	const docs = await AirQualityModel.aggregate([
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

		var tzDifference = d.getTimezoneOffset();
		var offsetTime = new Date(d.getTime() - tzDifference * 60 * 1000);

		console.log(offsetTime);

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
