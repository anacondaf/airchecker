const mongoose = require("mongoose");

const SubscriberSchema = new mongoose.Schema(
	{
		email: String
	},
	{
		timestamps: true,
	}
);

const MONGO_ATLAS_COLLECTION_NAME = "subscriber";
var SubscriberModel = mongoose.model(
	"Subscriber",
	SubscriberSchema,
	MONGO_ATLAS_COLLECTION_NAME
);

module.exports = SubscriberModel;
