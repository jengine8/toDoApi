const logger = require("../libs/logger");

const STATUS = require("../types/status");

const usersController = module.exports;
let mysql;
let _table = "users";

usersController.init = (dbClient) => {
  mysql = dbClient;
  return usersController;
};

usersController.createUser = async (req, res, next) => {
  try {
    logger.log({
      level: "info",
      label: "[usersController, createUser]",
      message: `start process to create a new user`,
    });

    const { email, password } = req.body;
    let emailExist = await _selectByEmail(["email"], email);

    if (emailExist.length > 0) {
      return res.status(STATUS.BAD_REQUEST).json({ msg: "User already exist" });
    } else {
      const user = await _insert({ email, password });
      res.status(STATUS.CREATED).json({ msg: "User has been created", user });
    }
  } catch (error) {
    logger.log({
      level: "error",
      label: "[usersController, createUser]",
      message: `something went wrong with a cretation of a new user`,
    });
    next(error);
  }
};

function _list() {
  return new Promise((resolve, reject) => {
    mysql
      .query("SELECT * FROM ??", _table)
      .then(resolve)
      .catch((err) => {
        reject(err);
      });
  });
}

function _insert(values) {
  return new Promise((resolve, reject) => {
    mysql
      .query("INSERT INTO ?? SET ?", [_table, values])
      .then(resolve)
      .catch((err) => {
        reject(err);
      });
  });
}

function _selectByEmail(columns, id) {
  return new Promise((resolve, reject) => {
    mysql
      .query("SELECT ?? FROM ?? WHERE email = ?", [columns, _table, id])
      .then(resolve)
      .catch((err) => {
        reject(err);
      });
  });
}

function _selectById(columns, id) {
  return new Promise((resolve, reject) => {
    mysql
      .query("SELECT ?? FROM ?? WHERE id = ?", [columns, _table, id])
      .then(resolve)
      .catch((err) => {
        reject(err);
      });
  });
}

function _update(values, id) {
  return new Promise((resolve, reject) => {
    mysql
      .query("UPDATE ?? SET ? WHERE id = ?", [_table, values, id])
      .then(resolve)
      .catch((err) => {
        reject(err);
      });
  });
}

function _delete(id) {
  return new Promise((resolve, reject) => {
    mysql
      .query("DELETE FROM ?? WHERE id = ?", [_table, id])
      .then(resolve)
      .catch((err) => {
        reject(err);
      });
  });
}
