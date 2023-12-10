const express = require("express");
const router = express.Router();
const analyticsRoute = require("./analytics.route");
const subscribersRoute = require("./subscribers.route");

const featureRoutes = [
	{
		path: "/analytics",
		route: analyticsRoute,
	},
	{
		path: "/subscribers",
		route: subscribersRoute,
	},
];

featureRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
