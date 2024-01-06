import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import styled from "styled-components";

// import "../../styles/statistic_chart.style.css";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ChartContainer = styled.div`
	height: 300px;
	display: flex;
	justify-content: center;
`;

const pieOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		datalabels: {
			// formatter: function (value, context) {
			// 	return context.chart.data.labels[context.dataIndex];
			// },
			font: {
				size: 24,
				weight: "bold",
			},
		},
		legend: {
			align: "center",
			position: "top",
			labels: {
				font: {
					size: 17,
				},
			},
		},
	},
};

export const PieChart = React.forwardRef((props, ref) => {
	const { data } = props;

	return (
		<div className="statistic_chart">
			<ChartContainer>
				<Pie
					data={data}
					options={pieOptions}
					height="150px"
					plugins={[ChartDataLabels]}
					ref={(e) => (ref.current[0] = e)}
				/>
			</ChartContainer>
		</div>
	);
});
