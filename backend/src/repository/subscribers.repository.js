const SubscriberModel = require("../models/Subscriber");

const findExistedSubscriber = async (email) => {
	let query = {
		email: email,
	};

	const subscriber = await SubscriberModel.findOne(query);
	return subscriber;
};

const insertNewSubscriber = async (email) => {
	let query = {
		email: email,
	};

	const subscriber = await SubscriberModel.create(query);
	return subscriber;
};

module.exports = { findExistedSubscriber, insertNewSubscriber };
