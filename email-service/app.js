const config = require("./config.json");
const logger = require("./logger");
const amqp = require("amqplib");

const sendMail = require("./transporter");

async function consumeMessages() {
	const connection = await amqp.connect(config.amqp.url);
	const channel = await connection.createChannel();

	await channel.assertExchange(config.amqp.exchangeName, "direct");

	const q = await channel.assertQueue(config.amqp.queueName);

	await channel.bindQueue(
		q.queue,
		config.amqp.exchangeName,
		config.amqp.bindingKey
	);

	channel.consume(q.queue, async (msg) => {
		const data = JSON.parse(msg.content);
		logger.info(
			`Receive message from exchange [${
				config.amqp.exchangeName
			}], data ${JSON.stringify(data)}`
		);

		const { message: mailList } = data;
		console.log(mailList);

		await sendMail(mailList);

		channel.ack(msg);
	});
}

consumeMessages();
