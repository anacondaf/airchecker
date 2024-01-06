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
	statisticsController,
} = require("../../controller/statistics.controller");

var getStatisticsValidationSchema = {
	[Segments.BODY]: Joi.object().keys({
		from: Joi.date().required(),
		to: Joi.date().greater(Joi.ref("from")).required(),
	}),
};

router.get("/range", async (req, res, next) => {
	var dto = await statisticsController.getStatisticDateRange();
	res.status(httpStatus.OK).json(dto);
});

router.get(
	"/monthly",
	celebrate(getStatisticsValidationSchema),
	async (req, res, next) => {
		var dto = await statisticsController.getMonthlyStatisticsData(req.query);
		res.status(httpStatus.OK).json(dto);
	}
);

module.exports = router;
