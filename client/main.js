const API_URL = "https://api.airchecker.online";
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
	var accTitle = document.getElementById("accordion-title");
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
					"Thành viên của các nhóm nhạy cảm có thể bị ảnh hưởng sức khỏe. Công chúng ít có khả năng bị ảnh hưởng.",
			},
		};

		return {
			levels: 2,
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
			...obj[lang],
		};
	}
}

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

window.onload = (event) => {
	var isWelcomed = sessionStorage.getItem("isWelcomed");
	console.log("isWelcomed: ", isWelcomed);

	if (!isWelcomed) requestNotificationPermission();

	var chart = initChart();

	socket.on("new-date", (msg) => {
		console.log(msg);

		const todayLabel = document.getElementById("today");
		todayLabel.innerHTML = msg.today;
	});

	socket.on("update-chart", async (msg) => {
		console.log(msg);

		var aqiLevel = document.getElementById("aqi-level");
		var aqiDescription = document.getElementById("aqi-desc");

		frenchkiss.set("en", {
			title: "Not grab data for today yet! Wait for next hour",
		});

		frenchkiss.set("vn", {
			title: "Chưa lấy dữ liệu cho ngày hôm nay! Đợi 1 tiếng sau bạn nhé",
		});

		if (msg.labels.length == 0 && msg.aqi == null) {
			Swal.fire({
				position: "center",
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
		}

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

		aqiLevel.classList.remove(
			aqiLevel.classList.item(aqiLevel.classList.length - 1)
		);

		aqiLevel.classList.add(levels);

		// Update pollutant
		const temp = document.getElementById("temp");
		temp.innerHTML = msg["temperature"];
		const humidity = document.getElementById("humidity");
		humidity.innerHTML = msg["humidity"];
		const co = document.getElementById("co");
		co.innerHTML = msg["co"];

		// Push Notification
		if (levels >= 1) {
			const subscription = sessionStorage.getItem("sw-subscription");

			await fetch(`${API_URL}/webpush/subscribe`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ subscription }),
			});
		}
	});

	var lang =
		document.getElementById("language-button").children[0].classList[1];

	sessionStorage.setItem("lang", lang);

	var chosenLng = sessionStorage.getItem("lang");
	i18next.changeLanguage(chosenLng, () => {
		rerender();
	});

	accordion();
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
								co: "Cacbon Monoxide",
							},
							accordion: {
								title: "View detail pollutants",
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
								co: "Cacbon Monoxide",
							},
							accordion: {
								title: "Xem chi tiết chất ô nhiễm",
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
}
