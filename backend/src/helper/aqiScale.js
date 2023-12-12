function getAQIInfo(aqi) {
	if (aqi >= 0 && aqi <= 50) {
		return {
			levels: 0,
			hexColor: "#00E400",
			levelsOfConcern: "Good",
			description:
				"Air quality is satisfactory, and air pollution poses little or no risk.",
		};
	} else if (aqi <= 100) {
		return {
			levels: 1,
			hexColor: "#FFFF00",
			levelsOfConcern: "Moderate",
			description:
				"Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
		};
	} else if (aqi <= 150) {
		return {
			levels: 2,
			hexColor: "#FF7E00",
			levelsOfConcern: "Unhealthy for Sensitive Groups",
			description:
				"Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
		};
	} else if (aqi <= 200) {
		return {
			levels: 3,
			hexColor: "#FF0000",
			levelsOfConcern: "Unhealthy",
			description:
				"Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
		};
	} else if (aqi <= 300) {
		return {
			levels: 4,
			hexColor: "#8F3F97",
			levelsOfConcern: "Very Unhealthy",
			description:
				"Health alert: The risk of health effects is increased for everyone.",
		};
	} else {
		return {
			levels: 5,
			hexColor: "#7E0023",
			levelsOfConcern: "Hazardous",
			description:
				"Health warning of emergency conditions: everyone is more likely to be affected.",
		};
	}
}

module.exports.getAQIInfo = getAQIInfo;
