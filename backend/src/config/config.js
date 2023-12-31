const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string()
			.valid("production", "development", "test")
			.required(),
		PORT: Joi.number().default(3000),
		DB_HOST: Joi.string(),
		DB_USERNAME: Joi.string(),
		DB_PASSWORD: Joi.string(),
		DB_NAME: Joi.string(),
		DB_PORT: Joi.string(),
		DB_URL: Joi.string(),
		MONGODB_URL: Joi.string().required().description("Mongo DB url"),
		MQTT_PROTOCOL: Joi.string(),
		MQTT_HOST: Joi.string(),
		MQTT_PORT: Joi.string(),
		MQTT_USER: Joi.string(),
		MQTT_PASSWORD: Joi.string(),
		VAPID_PUBLIC_KEY: Joi.string(),
		VAPID_PRIVATE_KEY: Joi.string(),
		AQI_API_TOKEN: Joi.string(),
		PREDICTION_SERVICE_URL: Joi.string(),
		RABBITMQ: Joi.string(),
		RABBITMQ_MAILSERVICE_EXCHANGE_NAME: Joi.string(),
		RABBITMQ_MAILSERVICE_QUEUE_NAME: Joi.string(),
		REDIS_HOST: Joi.string(),
		REDIS_PORT: Joi.string(),
		REDIS_PASSWORD: Joi.string(),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: "key" } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	host: envVars.DB_HOST,
	dbPort: envVars.DB_PORT,
	dbUserName: envVars.DB_USERNAME,
	dbPassword: envVars.DB_PASSWORD,
	dbName: envVars.DB_NAME,
	dbUrl: envVars.DB_URL,
	mqttProtocol: envVars.MQTT_PROTOCOL,
	mqttHost: envVars.MQTT_HOST,
	mqttPort: envVars.MQTT_PORT,
	mqttUser: envVars.MQTT_USER,
	mqttPassword: envVars.MQTT_PASSWORD,
	mongoose: {
		url: envVars.MONGODB_URL,
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},
	vapidPublicKey: envVars.VAPID_PUBLIC_KEY,
	vapidPrivateKey: envVars.VAPID_PRIVATE_KEY,
	aqiApiToken: envVars.AQI_API_TOKEN,
	predictionServiceUrl: envVars.PREDICTION_SERVICE_URL,
	rabbitmq: {
		url: envVars.RABBITMQ,
		mailServiceExchangeName: envVars.RABBITMQ_MAILSERVICE_EXCHANGE_NAME,
		mailServiceQueueName: envVars.RABBITMQ_MAILSERVICE_QUEUE_NAME,
	},
	redis: {
		host: envVars.REDIS_HOST,
		port: envVars.REDIS_PORT,
		password: envVars.REDIS_PASSWORD,
	},
};
