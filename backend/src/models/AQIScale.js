const mongoose = require("mongoose");
const logger = require("../config/logger");
const { aqiScaleMongooseEnumType } = require("../enums/aqi_level");

const AQIScaleSchema = new mongoose.Schema(
	{
		name: String,
		min: Number,
		max: Number,
		category: {
			type: String,
			enum: aqiScaleMongooseEnumType,
		},
	},
	{
		timestamps: true,
	}
);

const MONGO_ATLAS_COLLECTION_NAME = "aqi_scale";
var AQIScaleModel = mongoose.model(
	"AQIScale",
	AQIScaleSchema,
	MONGO_ATLAS_COLLECTION_NAME
);

// AQIScaleModel.createCollection().then(function (collection) {
// 	logger.info(`\n Collection [${MONGO_ATLAS_COLLECTION_NAME}] is created!`);
// });

module.exports = AQIScaleModel;
