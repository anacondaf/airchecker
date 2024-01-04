import { useState } from "react";
import { PieChart } from "../components/Statistics/PieChart";
import { BarChart } from "../components/Statistics/BarChart";

import { Divider, Button, Dropdown } from "semantic-ui-react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import styled from "styled-components";

import "../styles/statistics.style.css";

const ChartItemTitle = styled.h4`
	font-size: 15px;
	font-family: "Poppins", sans-serif;
	text-align: center;
	color: #000033;
	margin: 0;
`;

const Layout1 = styled.div`
	flex: 1;
	display: flex;
`;

const data = {
	labels: ["Spring", "Summer", "Autumn", "Winter"],
	datasets: [
		{
			label: "# of Votes",
			data: [50, 15, 20, 15],
			backgroundColor: [
				"rgb(228, 166, 70)",
				"rgb(49, 113, 182)",
				"rgb(0, 116, 135)",
				"rgb(229, 57, 69)",
			],
			datalabels: {
				color: "#ffffff",
			},
		},
	],
};

const barChartData = {
	labels: ["January", "February", "March", "April", "May", "June", "July"],
	datasets: [
		{
			label: "Dataset 1",
			data: [200, 50],
			backgroundColor: "rgb(0, 116, 135)",
			stack: "Stack 0",
			barPercentage: 1.1,
			// categoryPercentage: 1,
		},
		{
			label: "Dataset 2",
			data: [100, 20],
			backgroundColor: "rgb(75, 192, 192)",
			stack: "Stack 1",
			barPercentage: 1.1,
			// categoryPercentage: 1,
		},
	],
};

const styles = {
	dateTimePicker: {
		marginLeft: "16px",
	},
};

const DateTimePickerComponent = function ({ label }) {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DemoContainer components={["DateTimePicker"]}>
				<DateTimePicker label={label} style={styles.dateTimePicker} />
			</DemoContainer>
		</LocalizationProvider>
	);
};

const friendOptions = [
	{
		key: "2023",
		text: "2023",
		value: "2023",
	},
	{
		key: "2024",
		text: "2024",
		value: "2024",
	},
];

const ChartDropDown = function () {
	return (
		<Dropdown
			inline
			options={friendOptions}
			defaultValue={friendOptions[0].value}
		/>
	);
};

function Statistics() {
	const [value, onChange] = useState(new Date());

	return (
		<div className="statistics">
			<h1>Statistics</h1>

			<div className="query">
				<div className="picker">
					<DateTimePickerComponent label="From" />
					<span>-</span>
					<DateTimePickerComponent label="To" />
				</div>

				<Button primary className="submit_btn">
					Submit
				</Button>
			</div>

			<Divider />

			<div className="statistic_panel">
				<Layout1>
					<div className="chart_item">
						<div className="header">
							<ChartItemTitle className="chart_title">
								Pollution Index by Season
							</ChartItemTitle>

							<ChartDropDown />
						</div>

						<Divider style={{ width: "100%" }} />

						<PieChart data={data} />
					</div>

					<span className="custom_vert_divider"></span>

					<div className="chart_item" style={{ width: "700px" }}>
						<div className="header">
							<ChartItemTitle className="chart_title">
								Monthly Min-Max AQI value
							</ChartItemTitle>

							<ChartDropDown />
						</div>

						<Divider style={{ width: "100%" }} />

						<BarChart data={barChartData} />
					</div>
				</Layout1>
			</div>
		</div>
	);
}

export default Statistics;
