const { Server } = require("socket.io");

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
		});

		resolve({ message: "Socket.io is connected", io });
	});
};

module.exports = socketio;
