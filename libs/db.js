const { Sequelize } = require("sequelize");
require("dotenv").config();
const config = require("config").get("mysql");

const db = new Sequelize(config.name, config.user, process.env.BD_PASS, {
  host: config.host,
  dialect: "mysql",
  port: config.port,
  define: {
    timestamps: false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = db;
