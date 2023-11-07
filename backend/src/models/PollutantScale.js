const mongoose = require("mongoose");
const logger = require("../config/logger");

const PollutantScaleSchema = new mongoose.Schema(
	{
		name: String,
		unit: {
			type: String,
			required: false,
		},
		min: mongoose.Types.Decimal128,
		max: mongoose.Types.Decimal128,
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

PollutantScaleModel.createCollection().then(function (collection) {
	logger.info(`Collection [${MONGO_ATLAS_COLLECTION_NAME}] is created!`);
});

module.exports = PollutantScaleModel;
