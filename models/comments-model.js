const connection = require("../db/utils/connection");
const { checkArticleExists } = require("../db/utils/utils");

const fetchComments = (articleId, sortBy = "created_at", order = "desc") => {
  const allComments = connection
    .select("*")
    .from("comments")
    .where("article_id", articleId)
    .orderBy(sortBy, order);
  const trueOrFalse = checkArticleExists(articleId);
  //
  return Promise.all([allComments, trueOrFalse]).then(
    ([comments, trueOrFalse]) => {
      //
      if (!comments.length && trueOrFalse === false) {
        return Promise.reject({
          status: 404,
          msg: "Sorry, invalid article id"
        });
      } else {
        if (!comments.length && trueOrFalse === true) {
          return Promise.reject({
            status: 404,
            msg: "Sorry, this article has no comments yet"
          });
        }
      }
      return comments;
    }
  );
};

const addComment = (id, reqBody) => {
  const { username, body } = reqBody;

  const newComment = {
    article_id: id,
    author: username,
    body
  };

  return connection
    .insert(newComment)
    .into("comments")
    .where("article_id", id)
    .returning("*")
    .then(addedComment => {
      return addedComment[0];
    });
};

const changeComment = (id, changeVotesBy) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", id)
    .increment("votes", changeVotesBy)
    .returning("*")
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({ status: 400, msg: "invalid comment id" });
      }
      return comment[0];
    });
};

const removeComment = commentId => {
  return connection
    .del()
    .from("comments")
    .where("comments.comment_id", commentId)
    .then(response => {
      return response;
    });
};

module.exports = { fetchComments, addComment, changeComment, removeComment };
