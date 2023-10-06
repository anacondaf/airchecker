const mongoose = require("mongoose");

const AirQualitySchema = new mongoose.Schema(
	{
		aqi: Number,
		humidity: Number,
		temperature: Number,
		co: Number,
	},
	{
		timestamps: true,
	}
);

var AirQualityModel = mongoose.model("AirQuality", AirQualitySchema);

module.exports = AirQualityModel;
