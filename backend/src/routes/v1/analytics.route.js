const express = require("express");
const router = express.Router();
const { celebrate, Joi, Segments } = require("celebrate");
const {
	co,
	o3,
	pm25,
	tvoc,
	co2,
	humid,
	temp,
} = require("../../enums/pollutant_info");
const httpStatus = require("http-status");

const {
	analyticsController,
} = require("../../controller/analytics.controller");

var getAnalyticsValidationSchema = {
	[Segments.BODY]: Joi.object().keys({
		type: Joi.string().required().valid(co, o3, pm25, tvoc, co2, humid, temp),
	}),
};

router.get(
	"/",
	celebrate(getAnalyticsValidationSchema),
	async (req, res, next) => {
		// TODO: Get analytics data logic
		var dto = await analyticsController.getPollutantDatas(req.query);
		res.status(httpStatus.OK).json(dto);
	}
);

module.exports = router;
