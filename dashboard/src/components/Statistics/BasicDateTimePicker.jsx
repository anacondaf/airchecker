import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function BasicDateTimePicker() {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DemoContainer components={["DateTimePicker"]}>
				<DateTimePicker label="Basic date time picker" />
			</DemoContainer>
		</LocalizationProvider>
	);
}
