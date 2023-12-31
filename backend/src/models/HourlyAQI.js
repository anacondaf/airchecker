const mongoose = require("mongoose");

const HourlyAQISchema = new mongoose.Schema(
	{
		aqi: Number,
		dateTime: String,
	},
	{
		timestamps: false,
	}
);

const MONGO_ATLAS_COLLECTION_NAME = "hourly_aqi";

var HourlyAQIModel = mongoose.model(
	"HourlyAQI",
	HourlyAQISchema,
	MONGO_ATLAS_COLLECTION_NAME
);

module.exports = HourlyAQIModel;
