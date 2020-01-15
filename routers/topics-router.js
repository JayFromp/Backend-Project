const topicsRouter = require("express").Router();
const getTopics = require("../controllers/topics-controller");
const { badMethod } = require("../errors");
topicsRouter
  .route("/")
  .get(getTopics)
  .all(badMethod);
module.exports = topicsRouter;
