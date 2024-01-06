import { useState, useRef, useEffect, useCallback } from "react";
import { PieChart } from "../components/Statistics/PieChart";
import { BarChart } from "../components/Statistics/BarChart";

import { Divider, Dropdown } from "semantic-ui-react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import vi from "date-fns/locale/vi";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

import { Button as MuiBtn } from "@mui/material";
import { Download as DownloadIcon, Add as AddIcon } from "@mui/icons-material";

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

import { format as dateFnsFormat, formatISO, addHours } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

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
	flex: 1;
	display: flex;
	margin: 32px 0;
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
			label: "Max",
			data: [200, 50],
			backgroundColor: "rgb(0, 116, 135)",
			stack: "Stack 0",
			barPercentage: 1.1,
		},
		{
			label: "Min",
			data: [100, 20],
			backgroundColor: "rgb(75, 192, 192)",
			stack: "Stack 1",
			barPercentage: 1.1,
		},
	],
};

const styles = {
	dateTimePicker: {
		marginLeft: "16px",
	},
};

const DateTimePickerComponent = function ({ label, limit, onChangeFunc }) {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DemoContainer components={["DateTimePicker"]}>
				<DateTimePicker
					label={label}
					viewRenderers={{
						hours: renderTimeViewClock,
						minutes: renderTimeViewClock,
						seconds: renderTimeViewClock,
					}}
					style={styles.dateTimePicker}
					ampm={false}
					ampmInClock={false}
					maxDate={zonedTimeToUtc(limit.maxDate, "Asia/Bangkok")}
					minDate={zonedTimeToUtc(limit.minDate, "Asia/Bangkok")}
					format="dd/MM/yyyy HH:mm:ss"
					onChange={(e) => onChangeFunc(e)}
				/>
			</DemoContainer>
		</LocalizationProvider>
	);
};

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

const ChartDropDown = function () {
	return (
		<Dropdown
			inline
			options={yearDropDownOptions}
			defaultValue={yearDropDownOptions[0].value}
		/>
	);
};

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
	const { base64List, date } = props;

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
					Chart I: Pollution Index by Season [2023]
				</Text>

				<PdfImage style={pdfStyles.image} src={base64List[0]} />

				<Text style={pdfStyles.subtitle}>
					Chart II: Monthly Min-Max AQI value [2023]
				</Text>

				<PdfImage style={pdfStyles.image} src={base64List[1]} />

				<Text style={pdfStyles.text}>
					En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha
					mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga
					antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que
					carnero, salpicón las más noches, duelos y quebrantos los sábados,
					lentejas los viernes, algún palomino de añadidura los domingos,
					consumían las tres partes de su hacienda. El resto della concluían
					sayo de velarte, calzas de velludo para las fiestas con sus pantuflos
					de lo mismo, los días de entre semana se honraba con su vellori de lo
					más fino. Tenía en su casa una ama que pasaba de los cuarenta, y una
					sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que
					así ensillaba el rocín como tomaba la podadera. Frisaba la edad de
					nuestro hidalgo con los cincuenta años, era de complexión recia, seco
					de carnes, enjuto de rostro; gran madrugador y amigo de la caza.
					Quieren decir que tenía el sobrenombre de Quijada o Quesada (que en
					esto hay alguna diferencia en los autores que deste caso escriben),
					aunque por conjeturas verosímiles se deja entender que se llama
					Quijana; pero esto importa poco a nuestro cuento; basta que en la
					narración dél no se salga un punto de la verdad
				</Text>
			</Page>
		</Document>
	);
};

function Statistics() {
	const [statsMaxDate, setStatsMaxDate] = useState({
		from: null,
		to: null,
	});

	const [statsFromDate, setStatsFromDate] = useState();
	const [statsToDate, setStatsToDate] = useState();

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
				}}
			/>
		).toBlob();

		saveAs(blob, `statistic_report_${reportDate}.pdf`);
	};

	const onFromChange = (newValue) => {
		setStatsFromDate(formatISO(addHours(newValue, -7)));
	};

	const onToChange = (newValue) => {
		setStatsToDate(formatISO(addHours(newValue, -7)));
	};

	const onSubmitClick = async (e) => {
		try {
			const datas = await Axios.get(`stats/monthly?year=2024`, {
				headers: {
					"Content-Type": "application/json",
				},
			});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		async function fetchStatsDateRange() {
			let response = await Axios.getStatsDateRange();

			setStatsMaxDate({
				from: response.data.from[0].createdAt,
				to: response.data.to[0].createdAt,
			});
		}

		fetchStatsDateRange();
	}, []);

	return (
		<div className="statistics">
			<h1>Statistics</h1>

			<div className="query">
				<div className="picker">
					<DateTimePickerComponent
						label="From"
						limit={{ minDate: statsMaxDate.from, maxDate: statsMaxDate.to }}
						onChangeFunc={onFromChange}
					/>
					<span style={{ margin: "0 8px" }}>-</span>
					<DateTimePickerComponent
						label="To"
						limit={{ minDate: statsMaxDate.from, maxDate: statsMaxDate.to }}
						onChangeFunc={onToChange}
					/>
				</div>

				<div className="submit_btn_area">
					<MuiBtn
						variant="outlined"
						startIcon={<AddIcon />}
						style={{ marginRight: "16px" }}
						onClick={(e) => onSubmitClick(e)}
					>
						Submit
					</MuiBtn>

					<MuiBtn
						variant="outlined"
						startIcon={<DownloadIcon />}
						onClick={exportReport}
					>
						Export
					</MuiBtn>
				</div>
			</div>

			<Divider />

			<div className="statistic_panel">
				<div className="statistic_panel_container">
					<Layout1>
						<div className="chart_item">
							<div className="header">
								<ChartItemTitle className="chart_title">
									Pollution Index by Season
								</ChartItemTitle>

								<ChartDropDown />
							</div>

							<Divider style={{ width: "100%" }} />

							<PieChart data={data} ref={canvas} />
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

							<BarChart data={barChartData} ref={canvas} />
						</div>
					</Layout1>

					<Layout1>
						<div className="chart_item" style={{ width: "700px" }}>
							<div className="header">
								<ChartItemTitle className="chart_title">
									Pollutants Statistics Yearly
								</ChartItemTitle>

								<ChartDropDown />
							</div>

							<Divider style={{ width: "100%" }} />

							<BarChart data={barChartData} ref={canvas} />
						</div>
					</Layout1>
				</div>
			</div>
		</div>
	);
}

export default Statistics;
