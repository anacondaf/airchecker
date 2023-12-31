import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styled from "styled-components";

import "../../styles/statistic_chart.style.css";

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

const ChartContainer = styled.div``;

const options = {
	responsive: false,
	maintainAspectRatio: false,
	plugins: {
		title: {
			display: false,
		},
		legend: {
			align: "center",
			position: "left",
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
				display: false,
			},
			grid: {
				display: false,
			},
			border: {
				display: false,
			},
		},
		y: {
			ticks: {
				display: false,
			},
			grid: {
				display: false,
				lineWidth: 0,
			},
			border: {
				display: false,
			},
		},
	},
};

export const DoughnutChart = React.forwardRef((props, ref) => {
	const { data } = props;

	return (
		<div className="statistic_chart">
			<ChartContainer>
				<Doughnut
					data={data}
					options={options}
					height="300px"
					width="600px"
					plugins={[ChartDataLabels]}
					ref={(e) => (ref.current[3] = e)}
				/>
			</ChartContainer>
		</div>
	);
});
