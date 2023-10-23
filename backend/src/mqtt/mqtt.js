const mqtt = require("mqtt");
const config = require("../config/config");
const logger = require("../config/logger");
const { getData } = require("../helper/getData");
const AirQualityModel = require("../models/AirQuality");

const mqttClient = (io) => {
	return new Promise((resolve) => {
		const clientId = "mqtt_nodejs";
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
				console.log(message);

				var savedDocumentResult = await AirQualityModel.create({
					aqi: message["aqi"],
					humidity: message["humidity"],
					temperature: message["temp"],
					co: message["co"],
				});

				logger.info(
					`Result after create new document: \n ${savedDocumentResult}`
				);

				const { labels, aqi, datas, humidity, temperature, co } =
					await getData();

				io.emit("update-chart", {
					labels,
					aqi: aqi != null ? Math.round(aqi * 100) / 100 : null,
					datas,
					humidity,
					temperature,
					co,
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
