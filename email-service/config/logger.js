const winston = require("winston");
const config = require("./config");

const enumerateErrorFormat = winston.format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		enumerateErrorFormat(),
		config.env === "development"
			? winston.format.colorize()
			: winston.format.uncolorize(),
		winston.format.errors({ stack: true }),
		winston.format.json()
	),
	defaultMeta: { application: "email_service" },
	transports: [
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
	],
});

module.exports = logger;
