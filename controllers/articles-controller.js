const {
  fetchArticles,
  fetchArticleById,
  changeArticle,
  addArticle
} = require("../models/articles-model");

const getArticles = (req, res, next) => {
  const { sort_by, order, ...otherQueries } = req.query;

  fetchArticles(sort_by, order, otherQueries)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

const patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  changeArticle(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

const postArticle = (req, res, next) => {
  addArticle(req.body)
    .then(newArticle => {
      res.status(201).send({ newArticle });
    })
    .catch(err => {
      console.log(err);

      next(err);
    });
};

module.exports = { getArticles, getArticleById, patchArticle, postArticle };

// s("article_id").primary;
// articlesTable.string("title").notNullable();
// articlesTable.text("body").notNullable();
// articlesTable.integer("votes").defaultTo(0);
// articlesTable.string("topic").references("topics.slug");
// articlesTable.string("author").references("users.username");
// articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
