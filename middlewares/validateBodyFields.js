const CODES = require("../types/codes");
const STATUS = require("../types/status");
const logger = require("../libs/logger");
function validateFields(ajvValidator) {
  let date = new Date().toISOString();

  console.log(date);

  return (req, res, next) => {
    // logger.log({
    // 	level: 'info',
    // 	label: 'AJV first body',
    // 	message: JSON.stringify(req.body)
    // });
    if (req.file && req.file.filename) {
      req.body.photo = req.file.filename;
    }

    const valid = ajvValidator(req.body);

    // logger.log({
    // 	level: 'info',
    // 	label: 'AJV finish validation',
    // 	message: JSON.stringify(req.body)
    // });

    if (!valid) {
      const errors = ajvValidator.errors;

      return res
        .status(STATUS.UNPROCESSABLE)
        .json({ ok: false, msg: "Fields are invalid or null", errors });
    }
    next();
  };
}

module.exports = validateFields;
