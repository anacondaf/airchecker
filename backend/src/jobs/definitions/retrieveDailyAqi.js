const { aqiApiToken, predictionServiceUrl } = require("../../config/config");
const axios = require("axios");
const logger = require("../../config/logger");
const HourlyAQIModel = require("../../models/HourlyAQI");

const retrieveDailyAqi = async (agenda) => {
	try {
		// define(jobName, fn, [options])
		agenda.define(
			"retrieveDailyAqi",
			async function (job, done) {
				try {
					const hourlyAqi = await HourlyAQIModel.find();

					const compositeAqiObject = hourlyAqi.reduce((prev, curr) =>
						prev > curr ? prev : curr
					);

					var requestBody = {
						newAqi: compositeAqiObject.aqi,
						date: compositeAqiObject.dateTime.substring(0, 10),
					};

					console.log(requestBody);

					await axios({
						method: "post",
						url: `${predictionServiceUrl}/new/aqi`,
						data: requestBody,
					});

					await HourlyAQIModel.deleteMany();

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
