const express = require("express");
const users = require("../controllers/usersController");
const router = express.Router();
const validateFields = require("../middlewares/validateBodyFields");

router.post("/user", users.createUser);

module.exports = router;
