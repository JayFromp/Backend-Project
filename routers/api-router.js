const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const usersRouter = require("../routers/users-router");
const articlesRouter = require("../routers/articles-router");
const commentsRouter = require("./comments-router");
const { badMethod } = require("../errors");
const { getEndPoints } = require("../controllers/endpoints-controller");

apiRouter
  .route("/")
  .get(getEndPoints)
  .all(badMethod);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
