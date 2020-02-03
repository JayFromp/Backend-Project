const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const usersRouter = require("../routers/users-router");
const articlesRouter = require("../routers/articles-router");
const commentsRouter = require("./comments-router");
const { badMethod } = require("../errors");
const endpointsJSON = require("../endpoints.json");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter
  .route("/")
  .get((req, res) => {
    res.status(200).send({ endpointsJSON });
  })
  .all(badMethod);

module.exports = apiRouter;
