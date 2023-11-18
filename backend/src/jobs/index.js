const config = require("../config/config");
const { Agenda } = require("@hokify/agenda");
const logger = require("../config/logger");
const { loadDefinitions } = require("./definitions/index.js");

var mongoConnectionString = config.mongoose.url;
const processEvery = "60 seconds";

/**
 * If having trouble with "Agenda is not a constructor".
 * Follow this instruction: https://github.com/agenda/agenda/issues/1293
 */
var agenda = new Agenda({
	db: {
		address: mongoConnectionString,
		options: { useNewUrlParser: true },
		collection: "jobs",
	},
	useUnifiedTopology: true,
});

// Specifies the frequency at which agenda will query the database looking for jobs that need to be processed
agenda.processEvery(processEvery);

// listen for the ready or error event.
agenda
	.on("ready", () => logger.info("Agenda started!"))
	.on("error", () => logger.error("Agenda connection error!"));

// Define agenda definitions
loadDefinitions(agenda);

// Logs all registered jobs
console.log({ jobs: agenda.definitions });

module.exports = { agenda };
