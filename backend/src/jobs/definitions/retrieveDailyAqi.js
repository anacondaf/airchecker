const { aqiApiToken, predictionServiceUrl } = require("../../config/config");
const axios = require("axios");
const logger = require("../../config/logger");

const AQI_URL = "http://api.waqi.info";

const retrieveDailyAqi = async (agenda) => {
	try {
		// define(jobName, fn, [options])
		agenda.define(
			"retrieveDailyAqi",
			async function (job, done) {
				try {
					var response = await axios({
						method: "get",
						url: `${AQI_URL}/feed/@1583/?token=${aqiApiToken}`,
					});

					response = response.data;

					logger.info(
						`New AQI retrieved for date ${response.data.time.iso} from ${AQI_URL}: ${response.data.aqi}`
					);

					var requestBody = {
						newAqi: response.data.aqi,
						date: response.data.time.iso.substring(0, 10),
					};

					console.log(requestBody);

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
