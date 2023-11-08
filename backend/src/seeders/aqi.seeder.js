const { Seeder } = require("mongoose-data-seed");
const AQIScaleModel = require("../models/AQIScale");
const logger = require("../config/logger");
const path = require("path");
const fs = require("fs/promises");

class AQISeeder extends Seeder {
	async shouldRun() {
		return AQIScaleModel.countDocuments()
			.exec()
			.then((count) => count === 0);
	}

	async run() {
		try {
			const jsonData = await fs.readFile(
				path.join(__dirname, "../../seed-aqi-scale.json"),
				"utf8"
			);
			const data = JSON.parse(jsonData);

			return AQIScaleModel.create(data);
		} catch (error) {
			logger.error("Error when run aqi_scale seeding: " + error);
		}
	}
}

module.exports = AQISeeder;
