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

			const serverToday = new Date(Date.now());
			var today = new Date(serverToday.getTime() - -420 * 60 * 1000);

			socket.emit("new-date", {
				today: moment(today).format("DD/MM/YYYY"),
			});

			const {
				labels,
				aqi,
				datas,
				humidity,
				temperature,
				co,
				o3,
				co2,
				pm25,
				tvoc,
				calc_aqi,
			} = await getData();

			socket.emit("update-chart", {
				labels,
				aqi: aqi != null ? Math.round(aqi * 100) / 100 : null,
				datas,
				humidity,
				temperature,
				co,
				o3,
				co2,
				pm25,
				tvoc,
				calc_aqi,
			});
		});

		resolve({ message: "Socket.io is connected", io });
	});
};

module.exports = socketio;
