const mongoose = require("mongoose");

const AirQualitySchema = new mongoose.Schema(
	{
		aqi: Number,
		humidity: Number,
		temperature: Number,
		co: Number,
		co2: Number,
		tvoc: Number,
		o3: mongoose.Types.Decimal128,
		calc_aqi: Number,
	},
	{
		timestamps: true,
	}
);

const MONGO_ATLAS_COLLECTION_NAME = "airquality_new";
var AirQualityModel = mongoose.model(
	"AirQuality",
	AirQualitySchema,
	MONGO_ATLAS_COLLECTION_NAME
);

module.exports = AirQualityModel;
