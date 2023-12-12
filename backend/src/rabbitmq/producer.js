const amqp = require("amqplib");
const config = require("../config/config");
const logger = require("../config/logger");

let instance;

class Producer {
	channel;

	constructor() {
		if (instance) {
			throw new Error("New producer instance cannot be created");
		}

		(async () => {
			const connection = await amqp.connect(config.rabbitmq.url);
			this.channel = await connection.createChannel();
		})();

		instance = this;
	}

	async publishEmailMessage(message, routingKey = "MailService") {
		const mailServiceExchangeName = config.rabbitmq.mailServiceExchangeName;
		await this.channel.assertExchange(mailServiceExchangeName, "direct");

		const messageDetails = {
			logType: routingKey,
			message: message,
			dateTime: new Date(),
		};

		await this.channel.publish(
			mailServiceExchangeName,
			routingKey,
			Buffer.from(JSON.stringify(messageDetails))
		);

		logger.info(
			`The new ${routingKey} is sent to exchange ${mailServiceExchangeName}`
		);
	}
}

let producer = new Producer();

module.exports.producer = producer;
