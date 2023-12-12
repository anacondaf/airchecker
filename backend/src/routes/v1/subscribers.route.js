const express = require("express");
const router = express.Router();
const { celebrate, Joi, Segments } = require("celebrate");

const {
	subscribersController,
} = require("../../controller/subscribers.controller");

var insertSubscriberValidationSchema = {
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().required().email().messages({
			email: "Email is required and follow pattern example@gmail.com",
		}),
	}),
};

router.post(
	"/",
	celebrate(insertSubscriberValidationSchema),
	subscribersController.insertSubscriber
);

router.get("/", subscribersController.getAllSubscribers);

router.delete("/:id", subscribersController.deleteSubscriber);

module.exports = router;
