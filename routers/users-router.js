const usersRouter = require("express").Router();
const { getUserById, getUsers } = require("../controllers/users-controller");
const { badMethod } = require("../errors");

usersRouter
  .route("/")
  .get(getUsers)
  .all(badMethod);

usersRouter
  .route("/:username")
  .get(getUserById)
  .all(badMethod);

module.exports = usersRouter;
