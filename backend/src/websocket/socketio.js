const { Server } = require("socket.io");
const { getData } = require("../helper/getData");
const moment = require("moment");
const { calcPollutantAQI } = require("../helper/calculateTotalAQI");

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

			var aqiIndex = await calcPollutantAQI([
				{
					co: co,
					tvoc: tvoc,
					o3: o3,
					pm25: pm25,
				},
			]);

			const pollutantsAqi = aqiIndex[0]["pollutantsAqi"];

			socket.emit("update-chart", {
				labels,
				aqi: aqi != null ? Math.round(aqi * 100) / 100 : null,
				datas,
				humidity,
				temperature,
				co2,
				calc_aqi,
				co: {
					value: co,
					aqi: pollutantsAqi["co"],
				},
				o3: {
					value: o3,
					aqi: pollutantsAqi["o3"],
				},

				pm25: {
					value: pm25,
					aqi: pollutantsAqi["pm25"],
				},
				tvoc: {
					value: tvoc,
					aqi: pollutantsAqi["tvoc"],
				},
			});
		});

		resolve({ message: "Socket.io is connected", io });
	});
};

module.exports = socketio;
