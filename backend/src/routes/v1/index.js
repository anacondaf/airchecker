const express = require("express");
const router = express.Router();
const analyticsRoute = require("./analytics.route");
const subscribersRoute = require("./subscribers.route");
const statsRoute = require("./statistics.route");

const featureRoutes = [
	{
		path: "/analytics",
		route: analyticsRoute,
	},
	{
		path: "/subscribers",
		route: subscribersRoute,
	},
	{
		path: "/stats",
		route: statsRoute,
	},
];

featureRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
