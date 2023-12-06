import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Dropdown } from "semantic-ui-react";
import "../../styles/chart.style.css";
import pollutant_enum from "../../enums/pollutant_enum";
import "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart as ChartJS } from "chart.js";
ChartJS.register(zoomPlugin);

const filterByCategories = [
	"Last 12 hours",
	"Last 24 hours",
	"Today",
	"Last 7 days",
];

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
		title: {
			display: true,
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
	scales: {},
};

const itemsPerPage = 15;

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
			},
		],
	});

	const handleFilterByChange = (e, data) => {
		setFilterBy(data.children);
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
			let response = await axios.get(
				`${
					import.meta.env.VITE_API_URL
				}/v1/analytics?type=${pollutantType}&from=2023-11-05T00:00:00Z&to=2023-12-05T01:24:19.940Z`
			);

			console.log(response);

			const labels = response.data.map((x) => x.createdAt);
			const chartData = response.data.map((x) => {
				return x[pollutantType];
			});

			setAllData({ labels, data: chartData });
		}

		fetchAllData();
	}, [pollutantType]);

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
