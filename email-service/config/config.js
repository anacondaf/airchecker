const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string()
			.valid("production", "development", "test")
			.required(),
		RABBITMQ: Joi.string(),
		RABBITMQ_EXCHANGE_NAME: Joi.string(),
		RABBITMQ_QUEUE_NAME: Joi.string(),
		RABBITMQ_BINDING_KEY: Joi.string(),
		SMTP_PORT: Joi.string(),
		SMTP_HOST: Joi.string(),
		SMTP_USERNAME: Joi.string(),
		SMTP_PASSWORD: Joi.string(),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: "key" } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
	rabbitmq: {
		url: envVars.RABBITMQ,
		exchangeName: envVars.RABBITMQ_EXCHANGE_NAME,
		queueName: envVars.RABBITMQ_QUEUE_NAME,
		bindingKey: envVars.RABBITMQ_BINDING_KEY,
	},
	smtp: {
		port: envVars.SMTP_PORT,
		host: envVars.SMTP_HOST,
		username: envVars.SMTP_USERNAME,
		password: envVars.SMTP_PASSWORD,
	},
};
