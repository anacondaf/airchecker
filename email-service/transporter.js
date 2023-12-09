const nodemailer = require("nodemailer");
const config = require("./config.json");
const logger = require("./logger");

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

const sendMail = async (mailList) => {
	try {
		// send mail with defined transport object
		const info = await transporter.sendMail({
			to: mailList, // list of receivers
			subject: "AQI Level Alert", // Subject line
			text: "Hello world?", // plain text body
			html: "<b>Hello world?</b>", // html body
		});

		logger.info(`Message sent: ${info.messageId}`);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		//
		// NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
		//       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
		//       <https://github.com/forwardemail/preview-email>
		//
	} catch (error) {
		logger.error(`Error when send email to [${to}]: ${error}`);
	}
};

module.exports = sendMail;
