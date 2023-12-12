const nodemailer = require("nodemailer");
const config = require("./config.json");
const logger = require("./logger");
const fs = require("fs");
const handlebars = require("handlebars");
const textToImage = require("text-to-image");

const transporter = nodemailer.createTransport(
	{
		host: config.smtp_server.host,
		port: config.smtp_server.port,
		secure: true,
		auth: {
			user: config.smtp_server.username,
			pass: config.smtp_server.password,
		},
	},
	{
		from: `"AQI Alert ⚠️" ${config.smtp_server.username}`,
	}
);

const sendMail = async (mailList, data) => {
	logger.info(`Send mail to ${JSON.stringify(mailList)}`);

	try {
		const source = fs
			.readFileSync("./mails/aqi_alert.html", "utf-8")
			.toString();

		const template = handlebars.compile(source);

		const context = {
			data: data,
		};

		const htmlToSend = template(context);

		const info = await transporter.sendMail({
			to: mailList,
			subject: "AQI Level Alert",
			text: "Hello world?",
			html: htmlToSend,
		});

		logger.info(`Message sent: ${info.messageId}`);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (error) {
		logger.error(`Error when send email to [${to}]: ${error}`);
	}
};

module.exports = sendMail;
