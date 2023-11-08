const mongoose = require("mongoose");
const logger = require("../config/logger");
const { aqiScaleMongooseEnumType } = require("../enums/aqi_level");

const PollutantScaleSchema = new mongoose.Schema(
	{
		name: String,
		unit: {
			type: String,
			required: false,
		},
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

const MONGO_ATLAS_COLLECTION_NAME = "pollutant_scale";
var PollutantScaleModel = mongoose.model(
	"PollutantScale",
	PollutantScaleSchema,
	MONGO_ATLAS_COLLECTION_NAME
);

// PollutantScaleModel.createCollection().then(function (collection) {
// 	logger.info(`\n Collection [${MONGO_ATLAS_COLLECTION_NAME}] is created!`);
// });

module.exports = PollutantScaleModel;
