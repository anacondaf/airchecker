const subscribersService = require("../service/subscribers.service");
const catchAsync = require("../utils/catchAsync");
const { Response } = require("../utils/response");

const httpStatus = require("http-status");

const insertSubscriber = catchAsync(async (req, res) => {
	const DTO = await subscribersService.insertSubscriber(req.body);
	Response(res, httpStatus.CREATED, DTO.message, DTO.data);
});

const getAllSubscribers = catchAsync(async (req, res) => {
	const DTO = await subscribersService.getAllSubscribers();
	Response(res, httpStatus.OK, DTO.message, DTO.data);
});

const deleteSubscriber = catchAsync(async (req, res) => {
	const DTO = await subscribersService.deleteSubscriber(req.params);
	Response(res, httpStatus.OK, DTO.message, DTO.data);
});

exports.subscribersController = {
	insertSubscriber,
	getAllSubscribers,
	deleteSubscriber,
};
