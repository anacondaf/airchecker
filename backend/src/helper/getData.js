const AirQualityModel = require("../models/AirQuality");

const getData = async () => {
	const docs = await AirQualityModel.aggregate([
		{ $sort: { createdAt: 1 } },
		{ $limit: 6 },
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

	aqis = docs[0]["aqi"];
	humidity = docs[0]["humidity"][docs[0]["humidity"].length - 1];
	temperature = docs[0]["temperature"][docs[0]["temperature"].length - 1];
	co = docs[0]["co"][docs[0]["co"].length - 1];

	docs[0]["createdAt"] = docs[0]["createdAt"].map((x) => {
		const d = new Date(x);
		return d.getHours() + ":" + d.getMinutes();
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
