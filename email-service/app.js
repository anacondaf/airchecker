const config = require("./config.json");
const logger = require("./logger");
const amqp = require("amqplib");

const sendMail = require("./transporter");

async function consumeMessages() {
	try {
		const connection = await amqp.connect(config.amqp.url);

		logger.info("Connect RabbitMQ successfull");

		const channel = await connection.createChannel();

		await channel.assertExchange(config.amqp.exchangeName, "direct");

		const q = await channel.assertQueue(config.amqp.queueName);

		await channel.bindQueue(
			q.queue,
			config.amqp.exchangeName,
			config.amqp.bindingKey
		);

		channel.consume(q.queue, async (msg) => {
			const content = JSON.parse(msg.content);

			logger.info(
				`Receive message from exchange [${
					config.amqp.exchangeName
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
