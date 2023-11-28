const mqtt = require("mqtt");
const config = require("../config/config");
const logger = require("../config/logger");
const { getData } = require("../helper/getData");
const AirQualityModel = require("../models/AirQuality");
const { calcAQI } = require("../helper/calculateTotalAQI");

const mqttClient = (io) => {
	return new Promise((resolve) => {
		const clientId = "mqtt_nodejs_local";
		const connectUrl = `${config.mqttProtocol}://${config.mqttHost}:${config.mqttPort}`;

		const client = mqtt.connect(connectUrl, {
			clientId,
			clean: false,
			connectTimeout: 4000,
			username: config.mqttUser,
			password: config.mqttPassword,
			reconnectPeriod: 1000,
		});

		const dataTopic = "/airchecker";
		const notifyTopic = "/airchecker/noti";

		client.on("connect", async () => {
			logger.info(`Connect to mqtt ${connectUrl}`);

			await client.publishAsync(
				notifyTopic,
				`${clientId} is connected`,
				{
					qos: 0,
					retain: false,
				},
				(error) => {
					if (error) {
						console.error(error);
					}
				}
			);

			client.subscribe([dataTopic], async () => {
				logger.info(`Subscribe to topic '${dataTopic}'`);

				await client.publishAsync(
					notifyTopic,
					`${clientId} subscribes to topic ${dataTopic}`,
					{
						qos: 2,
						retain: false,
					},
					(error) => {
						if (error) {
							console.error(error);
						}
					}
				);
			});

			client.on("message", async (topic, message) => {
				message = JSON.parse(message);
				logger.info(`Message from MQTT Broker: ${message}`);

				var aqiIndex = await calcAQI([
					{
						co: message["co"],
						tvoc: message["tvoc"],
						o3: message["o3"],
						pm25: message["pm25"],
					},
				]);

				var savedDocumentResult = await AirQualityModel.create({
					aqi: message["aqi"],
					humidity: message["humidity"],
					temperature: message["temp"],
					co: message["co"],
					co2: message["co2"],
					tvoc: message["tvoc"],
					pm25: message["pm25"],
					o3: Math.round(message["o3"] * 1000) / 1000, // Truncate to 3 decimal places
					calc_aqi: aqiIndex[0]["maxAqiValue"],
				});

				logger.info(`Result after create new document: ${savedDocumentResult}`);

				const {
					labels,
					aqi,
					datas,
					humidity,
					temperature,
					co,
					o3,
					co2,
					pm25,
					tvoc,
					calc_aqi,
				} = await getData();

				const pollutantsAqi = aqiIndex[0]["pollutantsAqi"];

				io.emit("update-chart", {
					labels,
					aqi: aqi != null ? Math.round(aqi * 100) / 100 : null,
					datas,
					humidity,
					temperature,
					co2,
					calc_aqi,
					co: {
						value: co,
						aqi: pollutantsAqi["co"],
					},
					o3: {
						value: o3,
						aqi: pollutantsAqi["o3"],
					},

					pm25: {
						value: pm25,
						aqi: pollutantsAqi["pm25"],
					},
					tvoc: {
						value: tvoc,
						aqi: pollutantsAqi["tvoc"],
					},
				});
			});
		});

		client.on("reconnect", (error) => {
			logger.info("reconnect failed", error);
		});

		client.on("error", (error) => {
			logger.info("connection failed", error);
		});

		resolve({ message: "MQTT is connected", client });
	});
};

module.exports = mqttClient;
