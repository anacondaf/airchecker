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

var AirQualityModel = mongoose.model("AirQuality", AirQualitySchema);

module.exports = AirQualityModel;
