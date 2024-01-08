import { useState, useRef, useEffect, useCallback } from "react";
import { PieChart } from "../components/Statistics/PieChart";
import { BarChart } from "../components/Statistics/BarChart";
import { StackedBarChart } from "../components/Statistics/StackedBarChart";
import { DoughnutChart } from "../components/Statistics/DoughnutChart";

import { Divider, Dropdown } from "semantic-ui-react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import vi from "date-fns/locale/vi";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";

import { Button as MuiBtn } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

import { saveAs } from "file-saver";
import {
	Page,
	Text,
	Document,
	StyleSheet,
	Image as PdfImage,
	Font,
	pdf,
} from "@react-pdf/renderer";

import { format as dateFnsFormat } from "date-fns";

import styled from "styled-components";

import "../styles/statistics.style.css";

import { Axios } from "../config/axios";

const ChartItemTitle = styled.h4`
	font-size: 15px;
	font-family: "Poppins", sans-serif;
	text-align: center;
	color: #000033;
	margin: 0;
`;

const Layout1 = styled.div`
	display: flex;
	justify-content: space-between;
	margin: 32px 0;
	width: 100%;
`;

const yearDropDownOptions = [
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

// Create pdfStyles
const pdfStyles = StyleSheet.create({
	body: {
		paddingTop: 35,
		paddingBottom: 65,
		paddingHorizontal: 35,
	},
	title: {
		fontSize: 24,
		textAlign: "center",
		fontFamily: "Oswald",
	},
	date: {
		fontSize: 12,
		textAlign: "center",
		marginBottom: 35,
	},
	subtitle: {
		fontSize: 17,
		margin: 12,
		fontFamily: "Oswald",
	},
	text: {
		margin: 12,
		fontSize: 14,
		textAlign: "justify",
		fontFamily: "Times-Roman",
	},
	image: {
		marginVertical: 15,
		marginHorizontal: 100,
	},
	header: {
		fontSize: 12,
		marginBottom: 20,
		textAlign: "center",
		color: "grey",
	},
	pageNumber: {
		position: "absolute",
		fontSize: 12,
		bottom: 30,
		left: 0,
		right: 0,
		textAlign: "center",
		color: "grey",
	},
});

const PdfReportDocument = ({ props }) => {
	const {
		base64List,
		date,
		monthChartYear,
		seasonChartYear,
		doughnutChartYear,
		stackedBarChartYear,
	} = props;

	Font.register({
		family: "Oswald",
		src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
	});

	return (
		<Document>
			<Page page="A4" style={pdfStyles.body}>
				<Text style={pdfStyles.title}>Air Quality Report</Text>
				<Text style={pdfStyles.date}>{date}</Text>

				<Text style={pdfStyles.subtitle}>
					Chart I: Season AQI in year {seasonChartYear}
				</Text>

				<PdfImage style={pdfStyles.image} src={base64List[0]} />

				<Text style={pdfStyles.subtitle}>
					Chart II: Monthly Average AQI in year {monthChartYear}
				</Text>

				<PdfImage style={pdfStyles.image} src={base64List[1]} />

				<Text style={pdfStyles.subtitle}>
					Chart III: Monthly Avg Pollutants Value {stackedBarChartYear}
				</Text>

				<PdfImage style={pdfStyles.image} src={base64List[2]} />

				<Text style={pdfStyles.subtitle}>
					Chart IV: Top 3 Most Polluted Months {doughnutChartYear}
				</Text>

				<PdfImage style={pdfStyles.image} src={base64List[3]} />
			</Page>
		</Document>
	);
};

function Statistics() {
	const [seasonChartData, setSeasonChartData] = useState({
		labels: ["Spring", "Summer", "Autumn", "Winter"],
		datasets: [
			{
				label: "% pollution",
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
	});

	const [monthlyChartData, setMonthlyChartData] = useState({
		labels: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
		datasets: [
			{
				label: "Avg AQI",
				data: [200, 50],
				backgroundColor: "rgb(0, 116, 135)",
				stack: "Stack 0",
				barPercentage: 1.1,
			},
		],
	});

	const [doughnutChartData, setDoughnutChartData] = useState({
		labels: ["January", "June", "Dec"],
		datasets: [
			{
				label: "AQI value",
				data: [110, 50, 80],
				backgroundColor: [
					"rgb(79, 70, 229)",
					"rgb(59, 130, 246)",
					"rgb(49, 46, 129)",
				],
				borderWidth: 0,
			},
		],
	});

	const [stackedBarChartData, setStackedBarChartData] = useState({
		labels: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
		datasets: [
			{
				label: "O3",
				data: [11, 10, 2, 19],
				backgroundColor: "rgb(129, 140, 248)",
			},
			{
				label: "CO",
				data: [80, 10, 2, 19],
				backgroundColor: "rgb(199, 210, 254)",
			},
			{
				label: "PM25",
				data: [100, 10, 2, 19],
				backgroundColor: "rgb(55, 48, 163)",
			},
			{
				label: "TVOC",
				data: [230, 10, 2, 19],
				backgroundColor: "rgb(79, 70, 229)",
			},
		],
	});

	const [seasonChartYear, setSeasonChartYear] = useState(2023);
	const [monthChartYear, setMonthChartYear] = useState(2023);
	const [doughnutChartYear, setDoughnutChartYear] = useState(2023);
	const [stackedBarChartYear, setStackedChartYear] = useState(2023);

	const canvas = useRef([]);

	const exportReport = async () => {
		const base64List = [];

		for (let i = 0; i < canvas.current.length; i++) {
			const imageData = canvas.current[i].toBase64Image();

			base64List.push(imageData);
		}

		const reportDate = dateFnsFormat(new Date(), "dd/MM/yyyy-HH:mm:ss");

		const blob = await pdf(
			<PdfReportDocument
				props={{
					base64List: base64List,
					date: reportDate,
					monthChartYear: monthChartYear,
					seasonChartYear: seasonChartYear,
					doughnutChartYear,
					stackedBarChartYear,
				}}
			/>
		).toBlob();

		saveAs(blob, `statistic_report_${reportDate}.pdf`);
	};

	const getStatsSeason = async (year = 2023) => {
		setSeasonChartYear(year);

		const datas = await Axios.get(`stats/season?year=${year}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		setSeasonChartData((prevState) => ({
			...prevState,
			datasets: prevState.datasets.map((dataset) => ({
				...dataset,
				data: Object.values(datas.data).map((value) => parseFloat(value)),
			})),
		}));
	};

	const getStatsMonthly = async (year = 2023) => {
		setMonthChartYear(year);

		const datas = await Axios.get(`stats/monthly?year=${year}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		setMonthlyChartData((prevState) => ({
			...prevState,
			datasets: prevState.datasets.map((dataset) => ({
				...dataset,
				data: Object.values(datas.data).map((i) =>
					(Math.round(i.averageAqi * 100) / 100).toFixed(2)
				),
			})),
		}));
	};

	const getStatsMonthlyStackedBar = async (year = 2023) => {
		setStackedChartYear(year);

		const datas = await Axios.get(`stats/pollutants/monthly?year=${year}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		setStackedBarChartData((prevState) => ({
			...prevState,
			datasets: prevState.datasets.map((dataset) => ({
				label: dataset.label,
				backgroundColor: dataset.backgroundColor,
				data: datas.data.map((item) =>
					(Math.round(item.data[`avg${dataset.label}`] * 100) / 100).toFixed(1)
				),
			})),
		}));
	};

	// ======================================================================================================================

	const monthlyAvgAQIDropDownChangeHandler = (year) => {
		getStatsMonthly(year);
	};

	const seasonChartDropDownOnChangeHandler = (year) => {
		getStatsSeason(year);
	};

	const doughnutChartDropDownOnChangeHandler = (year) => {
		// getStatsMonthlyDoughnut(year);
	};

	const stackedChartDropDownOnChangeHandler = (year) => {
		getStatsMonthlyStackedBar(year);
	};

	useEffect(() => {
		async function fetchStatsDateRange() {
			getStatsSeason();
			getStatsMonthly();
			getStatsMonthlyStackedBar();
		}

		fetchStatsDateRange();
	}, []);

	return (
		<div className="statistics">
			<div className="query">
				<h1>Statistics</h1>
				<div className="submit_btn_area">
					<MuiBtn
						variant="outlined"
						startIcon={<DownloadIcon />}
						onClick={exportReport}
					>
						Export
					</MuiBtn>
				</div>
			</div>

			<div className="statistic_panel">
				<Layout1>
					<div className="chart_item" style={{ flexBasis: "48%" }}>
						<div className="header">
							<ChartItemTitle className="chart_title">
								Season AQI
							</ChartItemTitle>

							<Dropdown
								inline
								options={yearDropDownOptions}
								defaultValue={yearDropDownOptions[0].value}
								onChange={(e, data) =>
									seasonChartDropDownOnChangeHandler(data.value)
								}
							/>
						</div>

						<Divider style={{ width: "100%" }} />

						<PieChart data={seasonChartData} ref={canvas} />
					</div>

					<span className="custom_vert_divider"></span>

					<div className="chart_item" style={{ flexBasis: "52%" }}>
						<div className="header">
							<ChartItemTitle className="chart_title">
								Monthly Average AQI
							</ChartItemTitle>

							<Dropdown
								inline
								options={yearDropDownOptions}
								defaultValue={yearDropDownOptions[0].value}
								onChange={(e, data) =>
									monthlyAvgAQIDropDownChangeHandler(data.value)
								}
							/>
						</div>

						<Divider style={{ width: "100%" }} />

						<BarChart data={monthlyChartData} ref={canvas} />
					</div>
				</Layout1>

				<Layout1>
					<div className="chart_item" style={{ flexBasis: "53%" }}>
						<div className="header">
							<ChartItemTitle className="chart_title">
								Monthly Avg Pollutants Value
							</ChartItemTitle>

							{/* <LocalizationProvider dateAdapter={AdapterDateFns}>
								<DemoContainer components={["SingleInputDateRangeField"]}>
									<DateRangePicker
										slots={{ field: SingleInputDateRangeField }}
										name="allowedRange"
										sx={{
											"& .MuiStack-root": {
												paddingTop: 0,
											},
											"& .MuiInputBase-root": {
												"& .MuiInputBase-input": {
													padding: 1,
												},
											},
										}}
									/>
								</DemoContainer>
							</LocalizationProvider> */}
							<Dropdown
								inline
								options={yearDropDownOptions}
								defaultValue={yearDropDownOptions[0].value}
								onChange={(e, data) =>
									stackedChartDropDownOnChangeHandler(data.value)
								}
							/>
						</div>

						<Divider style={{ width: "100%" }} />

						<StackedBarChart data={stackedBarChartData} ref={canvas} />
					</div>

					<span className="custom_vert_divider"></span>

					<div className="chart_item" style={{ flexBasis: "47%" }}>
						<div className="header">
							<ChartItemTitle className="chart_title">
								Top 3 Most Polluted Months
							</ChartItemTitle>

							<Dropdown
								inline
								options={yearDropDownOptions}
								defaultValue={yearDropDownOptions[0].value}
								onChange={(e, data) =>
									doughnutChartDropDownOnChangeHandler(data.value)
								}
							/>
						</div>

						<Divider style={{ width: "100%" }} />

						<DoughnutChart data={doughnutChartData} ref={canvas} />
					</div>
				</Layout1>
			</div>
		</div>
	);
}

export default Statistics;
