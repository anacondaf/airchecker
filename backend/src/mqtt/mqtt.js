const mqtt = require("mqtt");
const config = require("../config/config");
const logger = require("../config/logger");
const { v4: uuidv4 } = require("uuid");
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
			await client.publishAsync(
				notifyTopic,
				`${clientId} is connected`,
				{
					qos: 2,
					retain: true,
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
						retain: true,
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

				await AirQualityModel.create({
					aqi: message["aqi"],
					humidity: message["humidity"],
					temperature: message["temp"],
					co: message["co"],
				});

				io.emit("update-chart", {
					labels: [
						"4:01",
						"4:02",
						"4:03",
						"4:04",
						"4:05",
						"4:06",
						"4:07",
						"4:08",
						"4:09",
					],
					datas: [0, 3, 5, 2, 3, 1, 2, 12, 12],
					aqi: Math.round(message["aqi"]),
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
