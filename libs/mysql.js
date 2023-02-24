const config = require("config").get("mysql");
const mysql = require("mysql");
const util = require("util");
require("dotenv").config();
const logger = require("../libs/logger");

const mysqlLib = module.exports;

const CONNECTION_LIMIT = config.connectionLimit || 10;

const MYSQL_HOST = config.host;
const MYSQL_PORT = config.port || 3306;
const MYSQL_USER = config.user || null;
const MYSQL_PASS = process.env.BD_PASS || null;
const MYSQL_NAME = config.name;

const MYSQL_OPTIONS = {
  connectionLimit: CONNECTION_LIMIT,
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASS,
  database: MYSQL_NAME,
  charset: "utf8mb4",
  timezone: "Z",
};

let _pool = mysql.createPool(MYSQL_OPTIONS);

_pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      logger.log({
        level: "error",
        label: "[mysql, getConnection]",
        message: "database connection was closed",
      });
      throw err;
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      logger.log({
        level: "error",
        label: "[mysql, getConnection]",
        message: "database has too many connections",
      });

      throw err;
    }
    if (err.code === "ECONNREFUSED") {
      logger.log({
        level: "error",
        label: "[mysql, getConnection]",
        message: "database connection was refused",
      });

      throw err;
    }
    if (err.code === "ER_BAD_DB_ERROR") {
      logger.log({
        level: "error",
        label: "[mysql, getConnection]",
        message: "database name is not valid",
      });

      throw err;
    }
  }
  if (connection) connection.release();
  return;
});
_pool.query = util.promisify(_pool.query);

mysqlLib.getClient = async function () {
  let result = await _pool.query("SELECT version()");
  logger.log({
    level: "silly",
    label: "[mysql, getClient]",
    message: result,
  });

  return _pool;
};
