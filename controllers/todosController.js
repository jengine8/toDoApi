const logger = require("../libs/logger");

const STATUS = require("../types/status");

const todosController = module.exports;
let mysql;
let _table = "todos";

todosController.init = (dbClient) => {
  mysql = dbClient;
  return todosController;
};

todosController.createToDo = async (req, res, next) => {
  try {
    logger.log({
      level: "info",
      label: "[todosController, createToDo]",
      message: `start process to create a new TODO`,
    });
    logger.log({
      level: "silly",
      label: "[todosController, createToDo]",
      message: req.body,
    });

    let newTodo = await mysql.query("INSERT INTO ?? SET ?", [_table, req.body]);

    res.status(201).json({ msg: "TODO created successfully", newTodo });
  } catch (error) {
    logger.log({
      level: "error",
      label: "[todosController, createToDo]",
      message: `something went wrong with a cretation of a new TODO`,
    });
    next(error);
  }
};

todosController.getAllTodos = async (req, res, next) => {
  try {
    logger.log({
      level: "info",
      label: "[todosController, getAllTodos]",
      message: `start process to searching all todos`,
    });

    let { owner } = req.params;

    let isNumber = Number.parseInt(owner);

    if (owner == null || owner == "" || !Number.isInteger(isNumber)) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ msg: "Missing owner id parameter..." });
    }
    let todos = await mysql.query(
      "SELECT id, title, description, progressStatus, deadline, responsible  FROM ?? WHERE owner= ?",
      [_table, owner]
    );

    if (todos.length > 0) {
      return res.json({ msg: "Results found", todos });
    } else {
      return res.status(STATUS.NOT_FOUND).json({ msg: "Not found todos..." });
    }
  } catch (error) {
    logger.log({
      level: "error",
      label: "[todosController, getAllTodos]",
      message: `something went wrong with todos search...`,
    });
    next(error);
  }
};
todosController.getTodo = async (req, res, next) => {
  try {
    logger.log({
      level: "info",
      label: "[todosController, getTodo]",
      message: `start process to searching todo information`,
    });

    // for more security is posisble to extract the owner of each todo that is located in jwt
    // and first query if
    // the owner really is who try to update this todo
    // let {owner} = req.decoded;
    // in this case the id is in query params

    let { owner } = req.query;
    let { todo } = req.params;

    let isNumber = Number.parseInt(todo);
    if (todo == null || todo == "" || !Number.isInteger(isNumber)) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ msg: "Missing todo id parameter..." });
    }

    if (owner == null || owner == "") {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ msg: "Missing owner query parameter..." });
    }

    let todos = await mysql.query(
      "SELECT * FROM ?? WHERE id= ? AND owner = ?",
      [_table, todo, owner]
    );

    if (todos.length > 0) {
      return res.json({ msg: "Results found", todos });
    } else {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ msg: "Not found todos with that criteria..." });
    }
  } catch (error) {
    logger.log({
      level: "error",
      label: "[todosController, getTodo]",
      message: `something went wrong with todos search...`,
    });
    next(error);
  }
};

todosController.updateToDo = async (req, res, next) => {
  try {
    logger.log({
      level: "info",
      label: "[todosController, updateToDo]",
      message: `start process to updating todo information`,
    });

    // for more security is posisble to extract the owner of each todo that is located in jwt
    // and first query if
    // the owner really is who try to update this todo
    // let {owner} = req.decoded;
    // in this case the id is in query params

    let { todo } = req.params;
    let { owner } = req.query;

    let isNumber = Number.parseInt(todo);
    if (todo == null || todo == "" || !Number.isInteger(isNumber)) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ msg: "Missing todo id parameter..." });
    }

    if (owner == null || owner == "") {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ msg: "Missing owner query parameter..." });
    }

    let todos = await mysql.query(
      "UPDATE ?? SET ? WHERE id = ? AND owner = ? ",
      [_table, req.body, todo, owner]
    );

    if (todos.affectedRows > 0) {
      return res.json({ msg: "To do updated successfully..." });
    } else {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ msg: "Todo not found to update information" });
    }
  } catch (error) {
    logger.log({
      level: "error",
      label: "[todosController, updateToDo]",
      message: `something went wrong with todo update process...`,
    });
    next(error);
  }
};

todosController.deleteToDo = async (req, res, next) => {
  try {
    logger.log({
      level: "info",
      label: "[todosController, deleteToDo]",
      message: `start process to delete todo`,
    });
    // for more security is posisble to extract the owner of each todo that is located in jwt
    // and first query if
    // the owner really is who try to delete this todo
    // let {owner} = req.decoded;
    // in this case the id is in query params

    let { todo } = req.params;
    let { owner } = req.query;

    let isNumber = Number.parseInt(todo);
    if (todo == null || todo == "" || !Number.isInteger(isNumber)) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ msg: "Missing todo id parameter..." });
    }
    if (owner == null || owner == "") {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ msg: "Missing owner query parameter..." });
    }

    let todos = await mysql.query("DELETE FROM ?? WHERE id = ? AND owner = ?", [
      _table,
      todo,
      owner,
    ]);
    if (todos.affectedRows > 0) {
      return res.json({ msg: "To do deleted successfully..." });
    } else {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ msg: "Todo not found to delete" });
    }
  } catch (error) {
    logger.log({
      level: "error",
      label: "[todosController, deleteToDo]",
      message: `something went wrong with todo delete process...`,
    });
    next(error);
  }
};
