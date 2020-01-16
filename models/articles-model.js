const connection = require("../db/utils/connection");
const { checkQueryExists } = require("../db/utils/utils");

const fetchArticles = (
  sortBy = "created_at",
  order = "desc",
  { author, topic }
) => {
  const doesAuthorExist = author
    ? checkQueryExists("users", "username", author)
    : null;

  const doesTopicExist = topic
    ? checkQueryExists("topics", "slug", topic)
    : null;

  const articlesRequest = connection
    .select("articles.*")
    .from("articles")
    .orderBy(sortBy, order)
    .modify(query => {
      if (author) {
        query.where("articles.author", author);
      }
      if (topic) {
        query.where("articles.topic", topic);
      }
    })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.article_id" })
    .then(articles => {
      return articles;
    });
  //
  //
  return Promise.all([doesTopicExist, doesAuthorExist, articlesRequest]).then(
    ([doesTopicExist, doesAuthorExist, articles]) => {
      if (doesAuthorExist === null && doesTopicExist == null) {
        return articles;
      }
      if (doesTopicExist === false) {
        return articles;
      }
      if (doesAuthorExist) {
        return articles;
      }
      return Promise.reject({ status: 404, msg: "x" });
    }
  );
};

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

const changeArticle = (id, changeVotesBy) => {
  return connection
    .select("*")
    .from("articles")
    .where("articles.article_id", id)
    .increment("votes", changeVotesBy)
    .returning("*")
    .then(articles => {
      if (!articles.length) {
        return Promise.reject({
          status: 404,
          msg: "Sorry, id does not exist"
        });
      }
      return articles[0];
    });
};

// check articles isn't empty
// send err to controller
// controller sends to error.js
// custom error sent to user

module.exports = { fetchArticles, fetchArticleById, changeArticle };