const subscribersService = require("../service/subscribers.service");
const catchAsync = require('../utils/catchAsync');
const { Response }  = require("../utils/response");

const httpStatus = require('http-status');

const insertSubscriber = catchAsync(async (req, res) => {
    const DTO = await subscribersService.insertSubscriber(req.body);
    Response(res, httpStatus.CREATED, DTO.message, DTO.data);
});

exports.subscribersController = {
	insertSubscriber,
};
