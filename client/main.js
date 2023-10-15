const socket = io("https://api.airchecker.online");

const initChart = () => {
	const myChartCanvas = document.getElementById("myChart");

	const checkAirLevel = (value) => {
		if (value > 0) {
			return "#38BC5B"; // GREEN
		} else if (value < 0) {
			return "rgb(192,75,75)"; // RED
		}

		return "#E0BB4B"; // YELLOW
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
							checkAirLevel(ctx.p0.parsed.y - ctx.p1.parsed.y),
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

var accordion = () => {
	var acc = document.getElementsByClassName("accordion");
	var accIcon = document.getElementById("acc-icon");
	var i;

	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function () {
			if (accIcon.classList.contains("fa-caret-down")) {
				accIcon.classList.remove("fa-caret-down");
				accIcon.classList.add("fa-caret-up");
			} else {
				accIcon.classList.remove("fa-caret-up");
				accIcon.classList.add("fa-caret-down");
			}

			/* Toggle between hiding and showing the active panel */
			var panel = this.nextElementSibling;
			if (panel.style.display === "grid") {
				panel.style.display = "none";
			} else {
				panel.style.display = "grid";
			}
		});
	}
};

function getAQIInfo(currentAQI) {
	if (currentAQI >= 0 && currentAQI <= 50) {
		return {
			levels: 0,
			levelsOfConcern: "Good",
			description:
				"Air quality is satisfactory, and air pollution poses little or no risk.",
		};
	} else if (currentAQI <= 100) {
		return {
			levels: 1,
			levelsOfConcern: "Moderate",
			description:
				"Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
		};
	} else if (currentAQI <= 150) {
		return {
			levels: 2,
			levelsOfConcern: "Unhealthy for Sensitive Groups",
			description:
				"Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
		};
	} else if (currentAQI <= 200) {
		return {
			levels: 3,
			levelsOfConcern: "Unhealthy",
			description:
				"Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
		};
	} else if (currentAQI <= 300) {
		return {
			levels: 4,
			levelsOfConcern: "Very Unhealthy",
			description:
				"Health alert: The risk of health effects is increased for everyone.",
		};
	} else {
		return {
			levels: 5,
			levelsOfConcern: "Hazardous",
			description:
				"Health warning of emergency conditions: everyone is more likely to be affected.",
		};
	}
}

window.onload = (event) => {
	var chart = initChart();

	socket.on("new-date", (msg) => {
		console.log(msg);

		const todayLabel = document.getElementById("today");
		todayLabel.innerHTML = msg.today;
	});

	socket.on("update-chart", (msg) => {
		console.log(msg);

		var aqiLevel = document.getElementById("aqi-level");
		var aqiDescription = document.getElementById("aqi-desc");

		// Update chart
		chart.data.labels = msg.labels;
		chart.data.datasets[0].data = msg.datas;
		chart.update();

		// Update current AQI
		const aqiText = document.getElementById("aqi");
		aqiText.innerHTML = msg.aqi;

		const { levels, levelsOfConcern, description } = getAQIInfo(msg.aqi);
		aqiLevel.innerHTML = levelsOfConcern;
		aqiDescription.innerHTML = description;

		// Update pollutant
		const temp = document.getElementById("temp");
		temp.innerHTML = msg["temperature"];
		const humidity = document.getElementById("humidity");
		humidity.innerHTML = msg["humidity"];
		const co = document.getElementById("co");
		co.innerHTML = msg["co"];
	});

	accordion();
};
