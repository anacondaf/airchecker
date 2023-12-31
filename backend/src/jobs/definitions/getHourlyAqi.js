const { aqiApiToken, predictionServiceUrl } = require("../../config/config");
const axios = require("axios");
const logger = require("../../config/logger");
const HourlyAQIModel = require("../../models/HourlyAQI");

const AQI_URL = "http://api.waqi.info";

const getHourlyAqi = async (agenda) => {
	try {
		// define(jobName, fn, [options])
		agenda.define(
			"getHourlyAqi",
			async function (job, done) {
				try {
					var response = await axios({
						method: "get",
						url: `${AQI_URL}/feed/@1583/?token=${aqiApiToken}`,
					});

					response = response.data;

					const aqi = await HourlyAQIModel.findOne({
						dateTime: response.data.time.iso,
					});

					logger.info(
						`New AQI retrieved for date ${response.data.time.iso} from ${AQI_URL}: ${response.data.aqi}`
					);

					if (!aqi) {
						await HourlyAQIModel.create({
							aqi: response.data.aqi,
							dateTime: response.data.time.iso,
						});
					}

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

module.exports = { getHourlyAqi };
