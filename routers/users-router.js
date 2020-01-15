const usersRouter = require("express").Router();
const { getUserById } = require("../controllers/users-controller");
const { badMethod } = require("../errors");

usersRouter
  .route("/:username")
  .get(getUserById)
  .all(badMethod);

module.exports = usersRouter;
