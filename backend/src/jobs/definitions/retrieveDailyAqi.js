const { aqiApiToken, predictionServiceUrl } = require("../../config/config");
const axios = require("axios");
const logger = require("../../config/logger");

const AirQualityModel = require("../../models/AirQuality");
const { mapServerTimeToVnTime } = require("../../helper/serverDate");

const retrieveDailyAqi = async (agenda) => {
	try {
		// define(jobName, fn, [options])
		agenda.define(
			"retrieveDailyAqi",
			async function (job, done) {
				try {
					const { offsetToday } = mapServerTimeToVnTime();
					const gmt7Offset = 7 * 60 * 60 * 1000;
					var offsetNextDay = new Date(offsetToday.getTime() + 24 * 3600 * 1000)
						.toISOString()
						.replace(/T(.+)/g, "T00:00:00.000Z");

					logger.info(`Get AQI for ${offsetToday}`);

					let hourlyAqi = await AirQualityModel.aggregate([
						{
							$addFields: {
								// Convert the createdAt field to GMT+7 by adding the offset
								createdAtGMT7: {
									$add: ["$createdAt", gmt7Offset],
								},
							},
						},
						{
							$match: {
								createdAtGMT7: {
									$gte: new Date(
										offsetToday
											.toISOString()
											.replace(/T(.+)/g, "T00:00:00.000Z")
									),
									$lt: new Date(offsetNextDay),
								},
							},
						},
						{
							$project: {
								_id: 1,
								aqi: 1,
								humidity: 1,
								temperature: 1,
								co: 1,
								co2: 1,
								tvoc: 1,
								o3: 1,
								pm25: 1,
								calc_aqi: 1,
								createdAt: "$createdAtGMT7",
							},
						},
					]).exec();

					logger.info(JSON.stringify(hourlyAqi));

					hourlyAqi = hourlyAqi.map((x) => {
						return {
							aqi: x.calc_aqi ?? x.aqi,
							dateTime: `${x.createdAt.toISOString()}`,
						};
					});

					logger.info(JSON.stringify(hourlyAqi));

					const compositeAqiObject = hourlyAqi.reduce((prev, curr) =>
						prev.aqi > curr.aqi ? prev : curr
					);

					var requestBody = {
						newAqi: compositeAqiObject.aqi,
						date: compositeAqiObject.dateTime.substring(0, 10),
					};

					logger.info(JSON.stringify(requestBody));

					await axios({
						method: "post",
						url: `${predictionServiceUrl}/new/aqi`,
						data: requestBody,
					});

					done();
				} catch (error) {
					console.error(error);

					logger.error(
						"Failed to update new daily aqi in job [agenda.retrieveDailyAqi] : " +
							error.message
					);
				}
			},
			{ priority: "highest", concurrency: 20 }
		);
	} catch (error) {
		logger.error("Error in job [agenda.retrieveDailyAqi] : " + error);
	}
};

module.exports = { retrieveDailyAqi };
