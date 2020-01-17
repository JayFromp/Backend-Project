const articlesRouter = require("express").Router();

const {
  getComments,
  postComment
} = require("../controllers/comments-controller");

const {
  getArticles,
  getArticleById,
  patchArticle
} = require("../controllers/articles-controller");

const { badMethod, badPath } = require("../errors");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(badMethod);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .all(badMethod);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment)
  .all(badMethod);

articlesRouter.use("/:article_id/*", badPath);

module.exports = articlesRouter;
