const httpStatus = require("http-status");
const { isCelebrateError } = require("celebrate");

const errorHandler = (err, req, res, next) => {
	if (!isCelebrateError(err)) {
		let { statusCode, message } = err;
		if (!err.isOperational) {
			statusCode = httpStatus.INTERNAL_SERVER_ERROR;
			message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
		}

		res.locals.errorMessage = err.message;

		const response = {
			statusCode,
			message,
			stack: err.stack,
		};

		res.status(statusCode).send(response);
	} else {
		next(err);
	}
};

module.exports = {
	errorHandler,
};
