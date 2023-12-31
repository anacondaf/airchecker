const { createClient } = require("redis");
const logger = require("../config/logger");
const config = require("../config/config");

var client = createClient({
	socket: {
		host: config.redis.host,
		port: config.redis.port,
	},
	username: "default",
	password: config.redis.password,
});

client.on("ready", () => {
	logger.info("Redis is connected");
});

client.on("error", (err) => {
	reject(`Redis Client Error [${err}]`);
});

(async () => {
	try {
		await client.connect();
	} catch (error) {
		reject(`error while connecting redis [${error}]`);
	}
})();

module.exports = { redisClient: client };
