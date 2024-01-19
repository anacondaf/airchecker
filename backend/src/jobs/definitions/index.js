const { retrieveDailyAqi } = require("./retrieveDailyAqi");
const logger = require("../../config/logger");

let definitions = [retrieveDailyAqi];

const loadDefinitions = async (agenda) => {
	try {
		console.log();
		for (let definition of definitions) {
			await definition(agenda);
		}
	} catch (error) {
		logger.error("Error when load agenda job definitions : " + error);
	}
};

module.exports = {
	loadDefinitions,
};
