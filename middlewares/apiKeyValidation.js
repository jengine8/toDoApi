const ApiErrorHandler = require("../libs/HandlingError");
const config = require("config").get("auth");
const STATUS = require("../types/status");
const CODES = require("../types/codes");

const apiKeyValidator = (req, res, next) => {
  const apiKey = req.header("apiKey");

  try {
    if (apiKey !== config.apiKey) {
      throw new ApiErrorHandler(
        STATUS.UNAUTHORIZED,
        "API KEY not valid...",
        CODES.UNAUTHORIZED
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = apiKeyValidator;
