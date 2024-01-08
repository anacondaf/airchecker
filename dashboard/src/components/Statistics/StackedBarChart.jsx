import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styled from "styled-components";

import "../../styles/statistic_chart.style.css";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ChartDataLabels
);

const ChartContainer = styled.div``;

const options = {
	responsive: false,
	maintainAspectRatio: false,
	plugins: {
		title: {
			align: "center",
			position: "bottom",
			font: {
				size: 17,
			},
		},
		legend: {
			align: "center",
			position: "top",
			labels: {
				font: {
					size: 14,
				},
			},
		},
		datalabels: {
			color: "#ffffff",
		},
	},
	scales: {
		x: {
			ticks: {
				font: {
					size: 15,
				},
			},
			stacked: true,
		},
		y: {
			stacked: true,
		},
	},
};

export const StackedBarChart = React.forwardRef((props, ref) => {
	const { data } = props;

	return (
		<div className="statistic_chart">
			<ChartContainer>
				<Bar
					data={data}
					options={options}
					height="300px"
					width="600px"
					plugins={[ChartDataLabels]}
					ref={(e) => (ref.current[2] = e)}
				/>
			</ChartContainer>
		</div>
	);
});
