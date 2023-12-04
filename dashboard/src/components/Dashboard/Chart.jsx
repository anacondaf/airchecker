import React, { PureComponent, useState, useEffect } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

import { Dropdown } from "semantic-ui-react";

import "../../styles/chart.style.css";

const data = [
	{
		name: "Page A",
		uv: 4000,
		pv: 2400,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 3000,
		pv: 1398,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 2000,
		pv: 9800,
		amt: 2290,
	},
	{
		name: "Page D",
		uv: 2780,
		pv: 3908,
		amt: 2000,
	},
	{
		name: "Page E",
		uv: 1890,
		pv: 4800,
		amt: 2181,
	},
	{
		name: "Page F",
		uv: 2390,
		pv: 3800,
		amt: 2500,
	},
	{
		name: "Page G",
		uv: 3490,
		pv: 4300,
		amt: 2100,
	},
];

const filterByCategories = [
	"Last 12 hours",
	"Last 24 hours",
	"Today",
	"Last 7 days",
	"Week",
	"Month",
];

const pollutantTypes = ["PM 2.5", "CO", "TVOC", "O3", "CO2", "Temp", "Humid"];

function Chart() {
	const [filterBy, setFilterBy] = useState(filterByCategories[0]);
	const [pollutantType, setPollutantType] = useState();

	const handleFilterByChange = (e, data) => {
		setFilterBy(data.children);
	};

	const handlePollutantTypeSelect = (e) => {
		const currentActiveType = document.querySelectorAll(
			".dashboard .chart .top .category .active"
		)[0];

		currentActiveType.classList.remove("active");
		e.target.classList.add("active");
	};

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

				<ResponsiveContainer width="100%" height={500}>
					<LineChart
						width={500}
						height={300}
						data={data}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line
							type="monotone"
							dataKey="pv"
							stroke="#8884d8"
							activeDot={{ r: 8 }}
						/>
						<Line type="monotone" dataKey="uv" stroke="#82ca9d" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</>
	);
}

export default Chart;
