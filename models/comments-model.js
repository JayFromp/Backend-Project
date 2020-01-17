const connection = require("../db/utils/connection");
const { checkArticleExists } = require("../db/utils/utils");

const fetchComments = (articleId, sortBy = "created_at", order = "desc") => {
  const allComments = connection
    .select("*")
    .from("comments")
    .where("article_id", articleId)
    .orderBy(sortBy, order);

  const trueOrFalse = checkArticleExists(articleId);

  return Promise.all([allComments, trueOrFalse]).then(
    ([comments, trueOrFalse]) => {
      if (!comments.length && trueOrFalse === false) {
        return Promise.reject({
          status: 404,
          msg: "Sorry, invalid article id"
        });
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

const changeComment = (id, changeVotesBy = 0) => {
  return connection("comments")
    .where("comment_id", id)
    .increment("votes", changeVotesBy)
    .returning("*")
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: "invalid comment id" });
      }
      return comment[0];
    });
};

const removeComment = commentId => {
  return connection
    .del()
    .from("comments")
    .where("comments.comment_id", commentId)
    .then(noOfDeletedComments => {
      if (noOfDeletedComments === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment id does not exist"
        });
      } else return noOfDeletedComments;
    });
};

module.exports = { fetchComments, addComment, changeComment, removeComment };
