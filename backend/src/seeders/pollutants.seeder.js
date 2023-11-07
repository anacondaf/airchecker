const { Seeder } = require("mongoose-data-seed");
const PollutantScaleModel = require("../models/PollutantScale");
const logger = require("../config/logger");
const path = require("path");
const fs = require("fs/promises");

class PollutantsSeeder extends Seeder {
	async shouldRun() {
		return PollutantScaleModel.countDocuments()
			.exec()
			.then((count) => count === 0);
	}

	async run() {
		try {
			const jsonData = await fs.readFile(
				path.join(__dirname, "../../seed-scale.json"),
				"utf8"
			);
			const data = JSON.parse(jsonData);

			return PollutantScaleModel.create(data);
		} catch (error) {
			logger.error("Error when run pollutants seeding: " + error);
		}
	}
}

module.exports = PollutantsSeeder;
