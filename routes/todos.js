const express = require("express");
const todos = require("../controllers/todosController");
const router = express.Router();
const validateFields = require("../middlewares/validateBodyFields");
const todoSchema = require("../schemas/todoSchema");

router.post("/todo", validateFields(todoSchema), todos.createToDo);

module.exports = router;
