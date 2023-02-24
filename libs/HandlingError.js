class ApiErrorHandler extends Error {
	constructor(statusCode, message, codeError) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;
		this.errorCode = codeError;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = ApiErrorHandler;
