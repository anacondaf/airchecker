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

router.get("/range", async (req, res, next) => {
	var dto = await statisticsController.getStatisticDateRange();
	res.status(httpStatus.OK).json(dto);
});

router.get("/monthly", async (req, res, next) => {
	var dto = await statisticsController.getMonthlyStatisticsData(req.query);
	res.status(httpStatus.OK).json(dto);
});

router.get("/season", async (req, res, next) => {
	var dto = await statisticsController.getSeasonStatisticsData(req.query);
	res.status(httpStatus.OK).json(dto);
});

module.exports = router;
