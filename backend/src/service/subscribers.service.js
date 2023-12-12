const subscribersRepository = require("../repository/subscribers.repository");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const insertSubscriber = async ({ email }) => {
	try {
		const existSubscriber = await subscribersRepository.findExistedSubscriber(
			email
		);

		console.log(existSubscriber);

		if (existSubscriber) {
			throw new ApiError(
				httpStatus.BAD_REQUEST,
				"Email address subscribed already"
			);
		}

		const response = await subscribersRepository.insertNewSubscriber(email);

		return {
			message: `Insert subscriber success with id ${response._id}`,
			data: response,
		};
	} catch (error) {
		let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

		if (error.statusCode) {
			statusCode = error.statusCode;
		}

		throw new ApiError(statusCode, error.message);
	}
};

const getAllSubscribers = async () => {
	try {
		const subscribers = await subscribersRepository.getAllSubscribers();

		return {
			message: "Get subscribers successfull",
			data: subscribers,
		};
	} catch (error) {
		let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

		if (error.statusCode) {
			statusCode = error.statusCode;
		}

		throw new ApiError(statusCode, error.message);
	}
};

const deleteSubscriber = async ({ id }) => {
	try {
		const res = await subscribersRepository.deleteSubscriberById(id);

		return {
			message: "Delete successfull",
			data: res,
		};
	} catch (error) {
		let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

		if (error.statusCode) {
			statusCode = error.statusCode;
		}

		throw new ApiError(statusCode, error.message);
	}
};

module.exports = {
	insertSubscriber,
	getAllSubscribers,
	deleteSubscriber,
};
