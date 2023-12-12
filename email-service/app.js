const config = require("./config/config");
const logger = require("./config/logger");
const amqp = require("amqplib");

const sendMail = require("./transporter");

async function consumeMessages() {
	try {
		const connection = await amqp.connect(config.rabbitmq.url);

		logger.info("Connect RabbitMQ successfull");

		const channel = await connection.createChannel();

		await channel.assertExchange(config.rabbitmq.exchangeName, "direct");

		const q = await channel.assertQueue(config.rabbitmq.queueName);

		await channel.bindQueue(
			q.queue,
			config.rabbitmq.exchangeName,
			config.rabbitmq.bindingKey
		);

		channel.consume(q.queue, async (msg) => {
			const content = JSON.parse(msg.content);

			logger.info(
				`Receive message from exchange [${
					config.rabbitmq.exchangeName
				}], data ${JSON.stringify(content)}`
			);

			const {
				message: { mailList, data },
			} = content;

			await sendMail(mailList, data);

			channel.ack(msg);
		});
	} catch (error) {
		logger.error(error);
	}
}

consumeMessages();
