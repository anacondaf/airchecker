import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Dropdown } from "semantic-ui-react";
import "../../styles/chart.style.css";
import pollutant_enum from "../../enums/pollutant_enum";
import "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { format } from "date-fns";
import { Chart as ChartJS } from "chart.js";
ChartJS.register(zoomPlugin);

const pollutantTypes = ["PM 2.5", "CO", "TVOC", "O3", "CO2", "Temp", "Humid"];

const mapping = {
	"PM 2.5": pollutant_enum.pm25,
	CO: pollutant_enum.co,
	TVOC: pollutant_enum.tvoc,
	O3: pollutant_enum.o3,
	CO2: pollutant_enum.co2,
	Temp: pollutant_enum.temp,
	Humid: pollutant_enum.humid,
};

const options = {
	responsive: true,
	plugins: {
		chartAreaBorder: {
			borderColor: "red",
			borderWidth: 2,
			borderDash: [5, 5],
			borderDashOffset: 2,
		},
		title: {
			display: true,
			text: "Chart with Tick Configuration",
		},
		zoom: {
			pan: {
				enabled: true,
				mode: "x",
			},
			zoom: {
				pinch: {
					enabled: true,
				},
				wheel: {
					enabled: true,
				},
				mode: "x",
			},
		},
	},
	scales: {
		x: {
			display: true,
			title: {
				display: true,
				text: "DateTime",
				color: "#911",
				font: {
					family: "Comic Sans MS",
					size: 15,
					weight: "bold",
					lineHeight: 1.2,
				},
				padding: { top: 10, left: 0, right: 0, bottom: 10 },
			},
			ticks: {
				callback: function (val, index) {
					// Hide every 2nd tick label
					return index % 2 === 0 ? this.getLabelForValue(val) : "";
				},
			},
			border: {
				display: true,
			},
			grid: {
				display: true,
				drawOnChartArea: true,
				drawTicks: true,
			},
		},
		y: {
			display: true,
			title: {
				display: true,
				text: "Value",
				color: "#000000",
				font: {
					family: "Comic Sans MS",
					size: 15,
					weight: "bold",
					lineHeight: 1.5,
				},
				padding: { top: 8, left: 0, right: 0, bottom: 0 },
			},
		},
	},
};

const itemsPerPage = 15;

const filterByCategories = [
	"Last 6 hours",
	"Last hour",
	"Last 12 hours",
	"Last 24 hours",
	"Today",
	"Last 7 days",
];

const filterByDateTime = (filterByIndex) => {
	// Get current date and time in GMT+0 (UTC)
	let now = new Date();
	let to = now.toISOString();

	switch (filterByIndex) {
		case 0: {
			// Last 6 hours
			var from = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
			break;
		}

		case 1: {
			// Last hour
			var from = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString();
			break;
		}

		case 2: {
			// Last 12 hours
			var from = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();
			break;
		}

		case 3: {
			// Last 24 hours
			var from = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
			break;
		}

		case 4: {
			// Today
			var from = new Date(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				now.getUTCDate()
			).toISOString();
			break;
		}

		// case 5: {
		// 	// Yesterday
		// 	var from = new Date(now.getTime() -  * 60 * 60 * 1000).toISOString();
		// 	break;
		// }

		case 5: {
			// Last 7 days
			var from = new Date(
				now.getTime() - 7 * 24 * 60 * 60 * 1000
			).toISOString();
			break;
		}

		default: {
		}
	}

	console.log(
		`Filter by [${filterByCategories[filterByIndex]}]: from [${from}] to [${to}]`
	);

	return {
		from,
		to,
	};
};

function Chart() {
	const [filterBy, setFilterBy] = useState(filterByCategories[0]);
	const [pollutantType, setPollutantType] = useState(
		mapping[pollutantTypes[0]]
	);
	const [page, setPage] = useState(0);
	const [allData, setAllData] = useState(null);
	const [data, setData] = useState({
		labels: [],
		datasets: [
			{
				label: pollutantType,
				data: [],
				tension: 0.5,
				fill: false,
				backgroundColor: "rgb(21, 105, 105)",
				borderColor: "rgb(75, 200, 192)",
				pointStyle: "circle",
				pointRadius: 5,
				pointHoverRadius: 8,
			},
		],
	});

	const { from, to } = filterByDateTime(filterByCategories.indexOf(filterBy));
	const [queryDate, setQueryDate] = useState({
		from: from,
		to: to,
	});

	const handleFilterByChange = (e, data) => {
		setFilterBy(data.children);
		const { from, to } = filterByDateTime(
			filterByCategories.indexOf(data.children)
		);

		setQueryDate({
			from,
			to,
		});
	};

	const handlePollutantTypeSelect = (e) => {
		const currentActiveType = document.querySelectorAll(
			".dashboard .chart .top .category .active"
		)[0];

		currentActiveType.classList.remove("active");
		e.target.classList.add("active");

		setPollutantType(mapping[e.target.innerHTML]);
		setPage(0);
	};

	useEffect(() => {
		async function fetchAllData() {
			console.log(`Fetch... ${import.meta.env.VITE_API_URL}`);

			let response = await axios.get(
				`${
					import.meta.env.VITE_API_URL
				}/v1/analytics?type=${pollutantType}&from=${queryDate.from}&to=${
					queryDate.to
				}`
			);

			const labels = response.data.map((x) => {
				const date = new Date(x.createdAt);
				return format(date, "dd-MMM-yyyy HH:mm:ss").split(" ");
			});

			const chartData = response.data.map((x) => {
				return x[pollutantType];
			});

			setAllData({ labels, data: chartData });
		}

		fetchAllData();
	}, [pollutantType, queryDate]);

	useEffect(() => {
		if (allData) {
			const labels = allData.labels.slice(
				page * itemsPerPage,
				(page + 1) * itemsPerPage
			);
			const chartData = allData.data.slice(
				page * itemsPerPage,
				(page + 1) * itemsPerPage
			);

			setData((prevState) => ({
				...prevState,
				labels: labels,
				datasets: prevState.datasets.map((dataset, i) =>
					i === 0
						? { ...dataset, data: chartData, label: pollutantType }
						: dataset
				),
			}));
		}
	}, [page, allData, pollutantType]);

	return (
		<>
			<div className="chart">
				<div className="top">
					<ul className="category">
						{pollutantTypes.map((p, idx) => {
							if (idx == 0) {
								return (
									<li
										className="active"
										key={idx}
										onClick={handlePollutantTypeSelect}
									>
										{p}
									</li>
								);
							}

							return (
								<li key={idx} onClick={handlePollutantTypeSelect}>
									{p}
								</li>
							);
						})}
					</ul>

					<Dropdown
						text={filterBy}
						icon="filter"
						floating
						labeled
						button
						className="icon"
					>
						<Dropdown.Menu>
							<Dropdown.Header icon="tags" content="Filter by tag" />
							<Dropdown.Divider />
							{filterByCategories.map((title, idx) => (
								<Dropdown.Item
									key={idx}
									onClick={(e, data) => handleFilterByChange(e, data)}
								>
									{title}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					</Dropdown>
				</div>

				<div className="buttons">
					<button onClick={() => setPage(page - 1)} disabled={page === 0}>
						Previous
					</button>
					<button
						onClick={() => setPage(page + 1)}
						disabled={
							!allData || (page + 1) * itemsPerPage >= allData.labels.length
						}
					>
						Next
					</button>
				</div>

				<div className="chart-container">
					<Line data={data} options={options} />
				</div>
			</div>
		</>
	);
}

export default Chart;
