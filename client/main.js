const socket = io("http://localhost:3000");

const initChart = () => {
	const myChartCanvas = document.getElementById("myChart");

	const checkAirLevel = (value) => {
		if (value < 2) {
			return "#38BC5B";
		} else if (value >= 5) {
			return "rgb(192,75,75)";
		}

		return "#E0BB4B";
	};

	const chart = new Chart(myChartCanvas, {
		type: "line",
		data: {
			labels: [
				"4:00",
				"4:01",
				"4:02",
				"4:03",
				"4:04",
				"4:05",
				"4:06",
				"4:07",
				"4:08",
			],
			datasets: [
				{
					data: [0, 3, 5, 2, 3, 1, 2, 12, 60],
					borderWidth: 1,
					tension: 0.5,
					pointBackgroundColor: "#18191C",
					pointBorderColor: "#ffffff",
					pointBorderWidth: 1.5,
					borderColor: "rgb(75, 192, 192)",
					segment: {
						borderColor: (ctx) =>
							checkAirLevel(Math.abs(ctx.p0.parsed.y - ctx.p1.parsed.y)),
					},
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
			plugins: {
				legend: {
					display: false,
				},
			},
		},
	});

	return chart;
};

window.onload = (event) => {
	var chart = initChart();

	socket.on("new-date", (msg) => {
		console.log(msg);

		const todayLabel = document.getElementById("today");
		todayLabel.innerHTML = msg.today;
	});

	socket.on("update-chart", (msg) => {
		console.log(msg);

		// Update chart
		chart.data.labels = msg.labels;
		chart.data.datasets[0].data = msg.datas;
		chart.update();

		// Update current AQI
		const aqiText = document.getElementById("aqi");
		aqiText.innerHTML = msg.aqi;
	});
};
