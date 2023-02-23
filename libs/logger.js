const { createLogger, format, transports } = require('winston');
const winston = require('winston');
const { combine, timestamp, prettyPrint, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
	format: combine(timestamp(), prettyPrint(), winston.format.colorize(), myFormat),
	transports: [ new transports.Console() ]
});

module.exports = logger;
