const mongoose = require("mongoose");

const pollutantSchema = new mongoose.Schema({
	name: String,
	unit: String,
	min: mongoose.Types.Decimal128,
	max: mongoose.Types.Decimal128,
});

const PollutantScaleSchema = new mongoose.Schema(
	{
		pollutant: pollutantSchema,
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

module.exports = PollutantScaleModel;
