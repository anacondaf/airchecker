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

const getAllSubscribers = async () => {
	const subscribers = await SubscriberModel.find();
	return subscribers;
};

const findSubscriberById = async (id) => {
	return await SubscriberModel.findOne({ _id: id });
};

const deleteSubscriberById = async (id) => {
	return await SubscriberModel.findByIdAndDelete(id);
};

module.exports = {
	findExistedSubscriber,
	insertNewSubscriber,
	getAllSubscribers,
	deleteSubscriberById,
	findSubscriberById,
};
