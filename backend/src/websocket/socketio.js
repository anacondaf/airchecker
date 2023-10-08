const { Server } = require("socket.io");
const { getData } = require("../helper/getData");
const moment = require("moment");

const socketio = (httpServer) => {
	return new Promise((resolve) => {
		const io = new Server(httpServer, {
			cors: {
				origin: "*",
			},
			// transports: ["websocket"],
		});

		io.on("connection", async (socket) => {
			console.log(socket.id);

			const today = moment().format("L");

			socket.emit("new-date", {
				today,
			});

			const { labels, aqi, datas, humidity, temperature, co } = await getData();

			socket.emit("update-chart", {
				labels,
				aqi: Math.trunc(aqi),
				datas,
				humidity,
				temperature,
				co,
			});
		});

		resolve({ message: "Socket.io is connected", io });
	});
};

module.exports = socketio;
