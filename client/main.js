const API_URL = "https://api.airqual.tech";
const PREDICT_URL = "https://predict.airqual.tech";

// const API_URL = "http://localhost";
// const PREDICT_URL = "http://localhost:8081";
const socket = io(API_URL);

const initChart = () => {
	const myChartCanvas = document.getElementById("myChart");

	const checkAirLevel = (value) => {
		if (value > 0) {
			return "#38BC5B"; // GREEN
		} else if (value < 0) {
			return "rgb(192,75,75)"; // RED
		} else {
			return "#E0BB4B"; // YELLOW
		}
	};

	const chart = new Chart(myChartCanvas, {
		type: "line",
		data: {
			labels: [
				"23/10/2023 4:00",
				"23/10/2023 4:01",
				"23/10/2023 4:02",
				"23/10/2023 4:03",
				"23/10/2023 4:04",
				"23/10/2023 4:05",
				"23/10/2023 4:06",
				"23/10/2023 4:07",
				"23/10/2023 4:08",
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
			responsive: true,
			maintainAspectRatio: false,
		},
	});

	return chart;
};

var accordion = (e) => {
	var accIcon = document.getElementById("acc-icon");
	var accTitle = document.getElementById("accordion-title");
	var panel = document.getElementsByClassName("panel-wrapper");

	if (accIcon.classList.contains("fa-caret-down")) {
		accIcon.classList.remove("fa-caret-down");
		accIcon.classList.add("fa-caret-up");
	} else {
		accIcon.classList.remove("fa-caret-up");
		accIcon.classList.add("fa-caret-down");
	}

	/* Toggle between hiding and showing the active panel */
	panel = panel[0];
	if (panel.style.display === "grid") {
		panel.style.display = "none";
	} else {
		panel.style.display = "grid";
	}

	e.preventDefault();
};

var aqiInfoLanguage = {
	0: {
		en: {
			levelsOfConcern: "Good",
			description:
				"Air quality is satisfactory, and air pollution poses little or no risk.",
		},
		vn: {
			levelsOfConcern: "Tốt",
			description:
				"Chất lượng không khí đạt yêu cầu và ô nhiễm không khí gây ra ít hoặc không có rủi ro.",
		},
	},
	1: {
		en: {
			levelsOfConcern: "Moderate",
			description:
				"Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
		},
		vn: {
			levelsOfConcern: "Vừa phải",
			description:
				"Chất lượng không khí ở mức chấp nhận được. Tuy nhiên, có thể có rủi ro đối với một số người, đặc biệt là những người nhạy cảm bất thường với ô nhiễm không khí.",
		},
	},
	2: {
		en: {
			levelsOfConcern: "Unhealthy for Sensitive Groups",
			description:
				"Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
		},
		vn: {
			levelsOfConcern: "Không lành mạnh cho các nhóm nhạy cảm",
			description:
				"Thành viên của các nhóm nhạy cảm có thể bị ảnh hưởng sức khỏe. Công chúng ít có khả năng bị ảnh hưởng.",
		},
	},
	3: {
		en: {
			levelsOfConcern: "Unhealthy",
			description:
				"Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
		},
		vn: {
			levelsOfConcern: "Không khỏe mạnh",
			description:
				"Một số thành viên của cộng đồng nói chung có thể bị ảnh hưởng về sức khỏe; thành viên của các nhóm nhạy cảm có thể bị ảnh hưởng sức khỏe nghiêm trọng hơn.",
		},
	},
	4: {
		en: {
			levelsOfConcern: "Very Unhealthy",
			description:
				"Health alert: The risk of health effects is increased for everyone.",
		},
		vn: {
			levelsOfConcern: "Rất không tốt cho sức khỏe",
			description:
				"Cảnh báo về sức khỏe: Nguy cơ ảnh hưởng đến sức khỏe ngày càng tăng đối với mọi người.",
		},
	},
	5: {
		en: {
			levelsOfConcern: "Hazardous",
			description:
				"Health warning of emergency conditions: everyone is more likely to be affected.",
		},
		vn: {
			levelsOfConcern: "Nguy hiểm",
			description:
				"Cảnh báo sức khỏe ở tình trạng khẩn cấp: mọi người đều có nhiều khả năng bị ảnh hưởng nhiều hơn.",
		},
	},
};

function getAQIInfo(currentAQI) {
	var lang = sessionStorage.getItem("lang");

	if (currentAQI >= 0 && currentAQI <= 50) {
		var obj = {
			en: {
				levelsOfConcern: "Good",
				description:
					"Air quality is satisfactory, and air pollution poses little or no risk.",
			},
			vn: {
				levelsOfConcern: "Tốt",
				description:
					"Chất lượng không khí đạt yêu cầu và ô nhiễm không khí gây ra ít hoặc không có rủi ro.",
			},
		};

		return {
			levels: 0,
			hexColor: "#00E400",
			...obj[lang],
		};
	} else if (currentAQI <= 100) {
		var obj = {
			en: {
				levelsOfConcern: "Moderate",
				description:
					"Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
			},
			vn: {
				levelsOfConcern: "Vừa phải",
				description:
					"Chất lượng không khí ở mức chấp nhận được. Tuy nhiên, có thể có rủi ro đối với một số người, đặc biệt là những người nhạy cảm bất thường với ô nhiễm không khí.",
			},
		};

		return {
			levels: 1,
			hexColor: "#FFFF00",
			...obj[lang],
		};
	} else if (currentAQI <= 150) {
		var obj = {
			en: {
				levelsOfConcern: "Unhealthy for Sensitive Groups",
				description:
					"Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
			},
			vn: {
				levelsOfConcern: "Không lành mạnh cho các nhóm nhạy cảm",
				description:
					"Những người thuộc nhóm nhạy cảm bị ảnh hưởng sức khỏe. Công chúng ít có khả năng bị ảnh hưởng.",
			},
		};

		return {
			levels: 2,
			hexColor: "#FF7E00",
			...obj[lang],
		};
	} else if (currentAQI <= 200) {
		var obj = {
			en: {
				levelsOfConcern: "Unhealthy",
				description:
					"Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
			},
			vn: {
				levelsOfConcern: "Không khỏe mạnh",
				description:
					"Một số thành viên của cộng đồng nói chung có thể bị ảnh hưởng về sức khỏe; thành viên của các nhóm nhạy cảm có thể bị ảnh hưởng sức khỏe nghiêm trọng hơn.",
			},
		};

		return {
			levels: 3,
			hexColor: "#FF0000",
			...obj[lang],
		};
	} else if (currentAQI <= 300) {
		var obj = {
			en: {
				levelsOfConcern: "Very Unhealthy",
				description:
					"Health alert: The risk of health effects is increased for everyone.",
			},
			vn: {
				levelsOfConcern: "Rất không tốt cho sức khỏe",
				description:
					"Cảnh báo về sức khỏe: Nguy cơ ảnh hưởng đến sức khỏe ngày càng tăng đối với mọi người.",
			},
		};

		return {
			levels: 4,
			hexColor: "#8F3F97",
			...obj[lang],
		};
	} else {
		var obj = {
			en: {
				levelsOfConcern: "Hazardous",
				description:
					"Health warning of emergency conditions: everyone is more likely to be affected.",
			},
			vn: {
				levelsOfConcern: "Nguy hiểm",
				description:
					"Cảnh báo sức khỏe ở tình trạng khẩn cấp: mọi người đều có nhiều khả năng bị ảnh hưởng nhiều hơn.",
			},
		};

		return {
			levels: 5,
			hexColor: "#7E0023",
			...obj[lang],
		};
	}
}

var forecastAqiLevelIconMapping = {
	0: {
		url: "1.png",
	},
	1: {
		url: "2.png",
	},
	2: {
		url: "3.png",
	},
	3: {
		url: "4.png",
	},
	4: {
		url: "5.png",
	},
	5: {
		url: "6.png",
	},
};

var requestNotificationPermission = () => {
	Notification.requestPermission().then((result) => {
		if (result === "granted") {
			console.log("Notification permission is granted");

			const notiTitle = "Welcome to Air Checker";
			const options = {
				icon: "./assets/favicon.png",
			};

			new Notification(notiTitle, options);
			sessionStorage.setItem("isWelcomed", true);
		}
	});
};

/**
 * Check if PWA is open:
 * Reference Document: https://web.dev/learn/pwa/detection
 */
// window.addEventListener("DOMContentLoaded", () => {
// 	let displayMode = "browser tab";
// 	if (window.matchMedia("(display-mode: standalone)").matches) {
// 		displayMode = "standalone";
// 	}
// 	// Log launch display mode to analytics
// 	console.log("DISPLAY_MODE_LAUNCH:", displayMode);
// });

function parseDateString(dateString) {
	var parts = dateString.split("/");
	// Note: months are zero-based in JavaScript Date objects
	return new Date(parts[2], parts[1] - 1, parts[0]);
}

// target_date must be in format of YYYY-MM-DD (ex: 2023-11-1)
const fetchPredictDatas = (target_date) => {
	var predictValues = JSON.parse(localStorage.getItem("predictValues"));

	if (!predictValues) {
		fetch(`${PREDICT_URL}/predict/aqi?target_date=${target_date}`, {
			method: "GET",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.json(); // Parse the response body as JSON
			})
			.then((data) => {
				predictValues = data;
				localStorage.setItem("predictValues", JSON.stringify(data));

				continueWithRestOfCode(predictValues);
			})
			.catch((error) => {
				console.error("Fetch error:", error);
			});
	} else {
		var firstDate = predictValues["predictedDates"][0];
		var firstDate = parseDateString(firstDate);

		if (new Date(firstDate) < new Date(target_date)) {
			fetch(`${PREDICT_URL}/predict/aqi?target_date=${target_date}`, {
				method: "GET",
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
					return response.json(); // Parse the response body as JSON
				})
				.then((data) => {
					predictValues = data;
					localStorage.setItem("predictValues", JSON.stringify(data));

					continueWithRestOfCode(predictValues);
				})
				.catch((error) => {
					console.error("Fetch error:", error);
				});
		}

		continueWithRestOfCode(predictValues);
	}

	function continueWithRestOfCode(predictValues) {
		console.log(predictValues);

		const forecastBoxes = document.getElementsByClassName("forecast-box");
		const predicts = predictValues["predictedAqis"];
		const predictDates = predictValues["predictedDates"];

		const forecaseLeft = (forecastBox, aqiInfo, predictAQI, predictDate) => {
			var forecastBoxLeftChildNodes = forecastBox.children[0].childNodes;

			var forecastLevel = forecastBoxLeftChildNodes[1];

			// Add class of AQI levels for changing language
			forecastLevel.classList.remove(
				forecastLevel.classList.item(forecastLevel.classList.length)
			);
			forecastLevel.classList.add(aqiInfo["levels"]);

			// Add levelsOfConcern for forecase-level h5
			forecastLevel.children[0].innerHTML = aqiInfo["levelsOfConcern"];

			// Get value of forecast-aqi h1
			var forecastAQI = forecastBoxLeftChildNodes[5];
			forecastAQI.children[1].innerHTML = predictAQI;

			var forecastDate = forecastBoxLeftChildNodes[3];
			forecastDate.innerHTML = predictDate;
		};

		const forecaseRight = (forecastBox, levels) => {
			var forecastBoxRightChildNodes = forecastBox.children[1].childNodes;

			var forecastAqiIcon = forecastBoxRightChildNodes[1].children[0];
			forecastAqiIcon.src = `assets/aqi_icon/${forecastAqiLevelIconMapping[levels]["url"]}`;
		};

		for (let i = 0; i < predicts.length; i++) {
			var forecastBox = forecastBoxes[i];

			const aqiInfo = getAQIInfo(predicts[i]);

			forecaseLeft(
				forecastBox,
				aqiInfo,
				Math.round(predicts[i]),
				predictDates[i]
			);
			forecaseRight(forecastBox, aqiInfo["levels"]);
		}
	}
};

const sweetAlert = () => {
	frenchkiss.set("en", {
		title: "Not grab data for today yet! Wait for next hour",
	});

	frenchkiss.set("vn", {
		title: "Chưa lấy dữ liệu cho ngày hôm nay! Đợi 1 tiếng sau bạn nhé",
	});

	Swal.fire({
		position: "top",
		title: frenchkiss.t("title", {}, sessionStorage.getItem("lang")),
		icon: "info",
		showCloseButton: true,
		timer: 2000,
		width: "25em",
		timerProgressBar: true,
		showConfirmButton: false,
		toast: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});
};

// Floating action button handler
const fabHandler = (e) => {
	const guideBook = document.getElementById("guide-book");

	guideBook.style.display = "flex";
	e.preventDefault();
};

const handleToolTip = (pollutantAQIInfo) => {
	const pollutantCardIndexMap = {
		0: "co",
		1: "tvoc",
		2: "o3",
		3: "pm25",
	};

	let pollutantCards = document.querySelectorAll(".pollutant-card");

	pollutantCards = Array.from(
		document.querySelectorAll(".pollutant-card")
	).slice(0, 4);

	pollutantCards.forEach((card, index) => {
		const tooltip = card.querySelector("#tooltip");
		let popperInstance = null;

		function create() {
			popperInstance = Popper.createPopper(card, tooltip, {
				placement: index % 2 == 0 ? "left" : "right",
				modifiers: [
					{
						name: "offset",
						options: {
							offset: [0, 5],
						},
					},
				],
			});
		}

		function show() {
			if (pollutantAQIInfo.get(pollutantCardIndexMap[index])["levels"] >= 3) {
				tooltip.setAttribute("data-show", "");
				create();
			}
		}

		function hide() {
			tooltip.removeAttribute("data-show");

			if (popperInstance) {
				popperInstance.destroy();
				popperInstance = null;
			}
		}

		const showEvents = ["mouseenter", "focus"];
		const hideEvents = ["mouseleave", "blur"];

		showEvents.forEach((event) => {
			card.addEventListener(event, show);
		});

		hideEvents.forEach((event) => {
			card.addEventListener(event, hide);
		});
	});
};

window.onload = (event) => {
	// var isWelcomed = sessionStorage.getItem("isWelcomed");
	// console.log("isWelcomed: ", isWelcomed);
	// if (!isWelcomed) requestNotificationPermission();

	var chart = initChart();
	var todayLabel = document.getElementById("today");

	socket.on("new-date", (msg) => {
		console.log(msg);
		todayLabel.innerHTML = msg.today;
	});

	// FORECAST--------------
	const today = new Date();
	console.log(today);

	const todayInTimeZone = today.toLocaleDateString("en-US", {
		timeZone: "Asia/Ho_Chi_Minh",
	});

	const [month, day, year] = todayInTimeZone.split("/");
	const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
		2,
		"0"
	)}`;

	fetchPredictDatas(formattedDate);
	// ---------------FORECAST

	socket.on("update-chart", async (msg) => {
		try {
			console.log(msg);
			var aqiLevel = document.getElementById("aqi-level");
			var aqiDescription = document.getElementById("aqi-desc");

			// Update chart
			chart.data.labels = msg.labels;
			chart.data.datasets[0].data = msg.datas;
			chart.update();

			// Update current AQI
			const aqi = msg["aqi"];
			const aqiText = document.getElementById("aqi");

			// Query pollutant
			const temp = document.getElementById("temp");
			const humidity = document.getElementById("humidity");
			const co = document.getElementById("co");
			const co2 = document.getElementById("co2");
			const tvoc = document.getElementById("tvoc");
			const o3 = document.getElementById("o3");
			const pm25 = document.getElementById("pm25");

			// Updated Time-Span
			const updatedTimeSpan = document.getElementById("updated-time-span");

			if (msg.labels.length == 0 && aqi == null) {
				aqiText.innerHTML = "-";
				aqiLevel.innerHTML = "-";
				aqiDescription.innerHTML = "-";

				temp.innerHTML = "-";
				humidity.innerHTML = "-";

				co.innerHTML = "-";
				co2.innerHTML = "-";
				tvoc.innerHTML = "-";
				o3.innerHTML = "-";
				pm25.innerHTML = "-";
				updatedTimeSpan.innerHTML = "-";

				sweetAlert();
			} else {
				// Tính thời gian cập nhật mới
				updatedTimeSpan.innerHTML = moment(msg.latestCreatedAt).fromNow();
				aqiText.innerHTML = aqi;

				const { levels, levelsOfConcern, description, hexColor } =
					getAQIInfo(aqi);

				aqiLevel.innerHTML = levelsOfConcern;
				aqiDescription.innerHTML = description;

				aqiLevel.classList.remove(
					aqiLevel.classList.item(aqiLevel.classList.length - 1)
				);

				aqiLevel.classList.add(levels);

				// Update composite AQI index-circle color
				const composeAQIIndexCircle = document.getElementsByClassName("index");
				composeAQIIndexCircle[0].style.background = `conic-gradient(${hexColor} 360deg, #383838 0deg)`;

				// Update new sensor pollutant value
				temp.innerHTML = msg["temperature"];
				humidity.innerHTML = msg["humidity"];
				co2.innerHTML = msg["co2"];

				pm25.innerHTML =
					msg["pm25"]["value"] != null ? msg["pm25"]["value"].toFixed(1) : null;
				co.innerHTML = Math.round(msg["co"]["value"] * 100) / 100;
				tvoc.innerHTML = msg["tvoc"]["value"];
				o3.innerHTML = Math.round(msg["o3"]["value"] * 10) / 10;

				// Update co, o3, pm25, tvoc sub AQI index-circle color
				const coAQIIndexCircle = document.getElementById("co-index");
				const tvocAQIIndexCircle = document.getElementById("tvoc-index");
				const o3AQIIndexCircle = document.getElementById("o3-index");
				const pm25coAQIIndexCircle = document.getElementById("pm25-index");

				const pollutantAQIInfo = new Map([
					["co", msg["co"]["aqi"]],
					["tvoc", msg["tvoc"]["aqi"]],
					["o3", msg["o3"]["aqi"]],
					["pm25", msg["pm25"]["aqi"]],
				]);

				for ([key, val] of pollutantAQIInfo.entries()) {
					pollutantAQIInfo.set(key, getAQIInfo(val));
				}

				console.log("pollutantAQIInfo: \n", pollutantAQIInfo);

				handleToolTip(pollutantAQIInfo);

				coAQIIndexCircle.style.background = `conic-gradient(${
					pollutantAQIInfo.get("co")["hexColor"]
				} 360deg, #383838 0deg)`;

				tvocAQIIndexCircle.style.background = `conic-gradient(${
					pollutantAQIInfo.get("tvoc")["hexColor"]
				} 360deg, #383838 0deg)`;

				o3AQIIndexCircle.style.background = `conic-gradient(${
					pollutantAQIInfo.get("o3")["hexColor"]
				} 360deg, #383838 0deg)`;

				pm25coAQIIndexCircle.style.background = `conic-gradient(${
					pollutantAQIInfo.get("pm25")["hexColor"]
				} 360deg, #383838 0deg)`;

				// Push Notification
				if (levels >= 3) {
					const subscription = sessionStorage.getItem("sw-subscription");
					await fetch(`${API_URL}/webpush/subscribe`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ subscription }),
					});
				}
			}
		} catch (error) {
			console.error(error);
		}
	});

	userTourGuideHandler();

	var lang =
		document.getElementById("language-button").children[0].classList[1];
	sessionStorage.setItem("lang", lang);

	var chosenLng = sessionStorage.getItem("lang");

	i18next.changeLanguage(chosenLng, () => {
		rerender();
	});
};

const userTourGuideHandler = () => {
	const tour = new Shepherd.Tour({
		defaultStepOptions: {
			cancelIcon: {
				enabled: true,
			},
			classes: "shepherd-theme-custom",
			scrollTo: { behavior: "smooth", block: "center" },
			exitOnEsc: true,
		},
	});

	tour.addStep({
		title: "Welcome to Airqual ",
		text: "Let's start with a quick product tour",
		buttons: [
			{
				action() {
					return this.cancel();
				},
				classes: "shepherd-button-secondary",
				text: "Exit",
			},
			{
				action() {
					return this.next();
				},
				text: "Next",
			},
		],
		id: "creating",
	});

	tour.addStep({
		title: "Location and Current Time",
		text: "Your current location and date time",
		attachTo: {
			element: ".left-panel .top .top-left p",
			on: "bottom",
		},
		buttons: [
			{
				action() {
					return this.back();
				},
				classes: "shepherd-button-secondary",
				text: "Back",
			},
			{
				action() {
					return this.next();
				},
				text: "Next",
			},
		],
		id: "location-currTime",
	});

	tour.addStep({
		title: "Language settings",
		text: "Using English or Vietnamese",
		attachTo: {
			element: ".left-panel .top .dropdown",
			on: "bottom",
		},
		buttons: [
			{
				action() {
					return this.back();
				},
				classes: "shepherd-button-secondary",
				text: "Back",
			},
			{
				action() {
					return this.next();
				},
				text: "Next",
			},
		],
		id: "language",
	});

	tour.addStep({
		title: "Composite AQI",
		text: "The latest overall AQI",
		attachTo: {
			element: ".time-seriers-db .air-info .index-circle .index",
			on: "bottom",
		},
		buttons: [
			{
				action() {
					return this.back();
				},
				classes: "shepherd-button-secondary",
				text: "Back",
			},
			{
				action() {
					return this.next();
				},
				text: "Next",
			},
		],
		id: "composite-aqi",
	});

	tour.addStep({
		title: "Historical data chart",
		text: "View historical data over hours",
		attachTo: {
			element: ".time-seriers-db .chart-container",
			on: "top",
		},
		buttons: [
			{
				action() {
					return this.back();
				},
				classes: "shepherd-button-secondary",
				text: "Back",
			},
			{
				action() {
					return this.next();
				},
				text: "Next",
			},
		],
		id: "chart",
	});

	tour.addStep({
		title: "Predict 2-days data",
		text: "View the next 2 days predicted AQI",
		attachTo: {
			element: ".forecast",
			on: "top",
		},
		buttons: [
			{
				action() {
					return this.back();
				},
				classes: "shepherd-button-secondary",
				text: "Back",
			},
			{
				action() {
					return this.next();
				},
				text: "Next",
			},
		],
		id: "chart",
	});

	tour.addStep({
		title: "Pollutants detail",
		text: "View more pollutants in detail",
		attachTo: {
			element: ".right-panel .detail-pollutants",
			on: "top",
		},
		buttons: [
			{
				action() {
					return this.back();
				},
				classes: "shepherd-button-secondary",
				text: "Back",
			},
			{
				action() {
					return this.next();
				},
				text: "Next",
			},
		],
		id: "chart",
	});

	tour.addStep({
		title: "Guide book",
		text: "Get to know about AQI, color, pollutants and more",
		attachTo: {
			element: ".floating-action-button",
			on: "top",
		},
		buttons: [
			{
				action() {
					return this.back();
				},
				classes: "shepherd-button-secondary",
				text: "Back",
			},
			{
				action() {
					return this.complete();
				},
				text: "Ok! I got it",
			},
		],
		id: "chart",
	});

	tour.start();
};

const lngs = {
	en: { nativeName: "English" },
	vn: { nativeName: "Vietnamese" },
};

const rerender = () => {
	$("body").localize();
};

$(function () {
	// use plugins and options as needed, for options, detail see
	// https://www.i18next.com
	i18next
		// detect user language
		// learn more: https://github.com/i18next/i18next-browser-languageDetector
		.use(i18nextBrowserLanguageDetector)
		// init i18next
		// for all options read: https://www.i18next.com/overview/configuration-options
		.init(
			{
				debug: true,
				fallbackLng: "en",
				resources: {
					en: {
						translation: {
							intro: {
								title: "Today's air quality",
								location: "Ho Chi Minh City, Viet Nam",
							},
							pollutant: {
								temp: "Temperature",
								humid: "Humidity",
								co: "Carbon Monoxide",
								co2: "CO2",
								tvoc: "TVOCs",
								o3: "Ozone (O3)",
								pm25: "PM2.5",
							},
							accordion: {
								title: "View detail pollutants",
							},
							forecast: {
								title: "Forecast today and tomorrow",
								aqi: "Air Quality Index",
							},
						},
					},
					vn: {
						translation: {
							intro: {
								title: "Chất lượng không khí hôm nay",
								location: "Thành phố Hồ Chí Minh, Việt Nam",
							},
							pollutant: {
								temp: "Nhiệt độ",
								humid: "Độ ẩm",
								co: "Khí Cacbon Monoxide",
								co2: "Khí CO2",
								tvoc: "Các chất hữu cơ độc hại",
								o3: "Khí Ozone (O3)",
								pm25: "Bụi mịn 2.5",
							},
							accordion: {
								title: "Xem chi tiết chất ô nhiễm",
							},
							forecast: {
								title: "Dự báo hôm nay và ngày mai",
								aqi: "Chỉ số chất lượng không khí",
							},
						},
					},
				},
			},
			(err, t) => {
				if (err) return console.error(err);

				// for options see
				// https://github.com/i18next/jquery-i18next#initialize-the-plugin
				jqueryI18next.init(i18next, $, { useOptionsAttr: true });

				// fill language switcher
				Object.keys(lngs).map((lng) => {
					const opt = new Option(lngs[lng].nativeName, lng);

					if (lng === i18next.resolvedLanguage) {
						opt.setAttribute("selected", "selected");
					}
				});

				rerender();
			}
		);
});

function langDropdownClick() {
	document.getElementById("lang-drop-down").classList.toggle("drop-down-show");
}

function langBoxOnClick(event) {
	document.getElementById("lang-drop-down").classList.toggle("drop-down-show");

	var languageButton = document.getElementById("language-button");
	languageButton.children[0].src = event.children[1].src;

	var langButtonImageClassList = languageButton.children[0].classList;

	langButtonImageClassList.remove(
		langButtonImageClassList.item(langButtonImageClassList.length - 1)
	);

	var langClass = event.children[1].classList[1];

	langButtonImageClassList.add(langClass);
	var chosenLng = langClass;

	sessionStorage.setItem("lang", chosenLng);

	i18next.changeLanguage(chosenLng, () => {
		rerender();
	});

	var aqiLevel = document.getElementById("aqi-level");
	var aqiDescription = document.getElementById("aqi-desc");

	aqiLevel.innerHTML =
		aqiInfoLanguage[aqiLevel.classList[0]][chosenLng]["levelsOfConcern"];

	aqiDescription.innerHTML =
		aqiInfoLanguage[aqiLevel.classList[0]][chosenLng]["description"];

	// FORECAST
	var forecastAqiLevels = document.getElementsByClassName("forecast-level");

	for (const forecastAqiLevel of forecastAqiLevels) {
		let length = forecastAqiLevel.classList.length;

		forecastAqiLevel.children[0].innerHTML =
			aqiInfoLanguage[forecastAqiLevel.classList[length - 1]][chosenLng][
				"levelsOfConcern"
			];
	}
}
