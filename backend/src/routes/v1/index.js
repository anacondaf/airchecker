const express = require("express");
const router = express.Router();
const analyticsRoute = require("./analytics");

const featureRoutes = [
	{
		path: "/analytics",
		route: analyticsRoute,
	},
];

featureRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
