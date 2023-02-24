const logger = require("./logger");

const ErrorControling = (err, req, res, next) => {
  const statusCode = err.statusCode || 400;
  console.log(err);
  logger.log({ level: "error", label: "Error Controlling", message: err });
  res.status(statusCode).json({
    ok: false,
    message: err.message,
  });
};

module.exports = ErrorControling;
