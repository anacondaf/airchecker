/**
 * Response format for all apis
 * @param {Object} res
 * @param {Number} statusCode
 * @param {String} message
 * @param {String | null} data
 */
const response = (res, statusCode, message, data) => {
  res.status(statusCode).json({ message, data, statusCode });
};

module.exports = {
  Response: response,
};