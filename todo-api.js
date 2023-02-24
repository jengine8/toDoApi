const config = require("config");
const logger = require("./libs/logger");
const cors = require("cors");
const express = require("express");
const PORT = config.application.port;
const ErrorControling = require("./libs/ErrorControl");
const ApiErrorHandler = require("./libs/HandlingError");
const mysql = require("./libs/mysql");
const validateRequest = require("./middlewares/validateBodyFields");
const apiKeyValidator = require("./middlewares/apiKeyValidation");
const todoSchema = require("./schemas/todoSchema");
const todoUpdateSchema = require("./schemas/todoUpdateSchema");
const userSchema = require("./schemas/userSchema");
const STATUS = require("./types/status");
const CODES = require("./types/codes");
require("dotenv").config();

const app = express();
const router = express.Router();
app.use(express.json());

app.use(cors());

let dbClient;

(async () => {
  // Connection to Data Base

  try {
    dbClient = await mysql.getClient();
  } catch (error) {
    
    logger.log({
      level:"error",
      label:"[mysql connection]",
      message:error
    })

    

    
  }

  

  const users = require("./controllers/usersController").init(dbClient);
  const todos = require("./controllers/todosController").init(dbClient);

  router.post(
    "/user",
    apiKeyValidator,
    validateRequest(userSchema),
    users.createUser
  );

  router.post(
    "/todo",
    apiKeyValidator,
    validateRequest(todoSchema),
    todos.createToDo
  );
  router.get("/todos/:owner", apiKeyValidator, todos.getAllTodos);
  router.get("/todo/:todo", apiKeyValidator, todos.getTodo);
  router.put(
    "/todo/:todo",
    apiKeyValidator,
    validateRequest(todoUpdateSchema),
    todos.updateToDo
  );
  router.delete("/todo/:todo", apiKeyValidator, todos.deleteToDo);

  app.use("/api", router);

  app.all("*", (req, res, next) => {
    const err = new Error(`Request to URL: ${req.path} not found`);
    err.statusCode = 404;
    next(err);
  });

  app.use(ErrorControling);

  app.listen(PORT, () => {
    logger.log({
      level: "info",
      label: "todo-api",
      message: `Api running at ${PORT} port...`,
    });
  });
})().catch((e) => {
  if ("stack" in e) {
    logger.log({
      level: "error",
      label: "[todo-api main function]",
      message: e.stack,
    });
  }
  logger.log({
    level: "error",
    label: "[todo-api main function]",
    message: e,
  });
  logger.error(e);
});
