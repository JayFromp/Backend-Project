const connection = require("../db/utils/connection");

const fetchArticleById = id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.article_id" })
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Sorry, id does not exist" });
      }
      return article[0];
    });
};

const changeArticle = () => {};

module.exports = { fetchArticleById, changeArticle };
