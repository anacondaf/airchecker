const amqp = require("amqplib");
const config = require("../config/config");
const logger = require("../config/logger");

class Producer {
	channel;

	async createChannel() {
		const connection = await amqp.connect(config.rabbitmq.url);
		this.channel = await connection.createChannel();
	}

	async publishEmailMessage(message, routingKey = "MailService") {
		if (!this.channel) {
			await this.createChannel();
		}

		const mailServiceExchangeName = config.rabbitmq.mailServiceExchangeName;
		await this.channel.assertExchange(mailServiceExchangeName, "direct");

		const logDetails = {
			logType: routingKey,
			message: message,
			dateTime: new Date(),
		};

		await this.channel.publish(
			mailServiceExchangeName,
			routingKey,
			Buffer.from(JSON.stringify(logDetails))
		);

		logger.info(
			`The new ${routingKey} is sent to exchange ${mailServiceExchangeName}`
		);
	}
}

module.exports = Producer;
