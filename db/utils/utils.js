const connection = require("../utils/connection");
exports.formatDates = list => {
  const newList = [];
  list.forEach(article => {
    const newArticle = { ...article };
    if (newArticle.hasOwnProperty("created_at")) {
      newArticle.created_at = new Date(newArticle.created_at);
    }
    newList.push(newArticle);
  });
  return newList;
};

exports.makeRefObj = (arr, key, value) => {
  const output = {};
  arr.forEach(obj => {
    const newObj = { ...obj };
    if (newObj.hasOwnProperty(key)) {
      output[newObj[key]] = newObj[value];
    }
  });
  return output;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const newComment = { ...comment };
    //
    newComment["article_id"] = articleRef[newComment.belongs_to];
    delete newComment["belongs_to"];
    //
    newComment["author"] = newComment["created_by"];
    delete newComment["created_by"];
    //
    newComment["created_at"] = new Date(newComment.created_at);
    //
    return newComment;
  });
};

exports.checkArticleExists = articleId => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", articleId)
    .then(articleArray => {
      return articleArray.length > 0 ? true : false;
    });
};

exports.checkQueryExists = (table, column, value) => {
  return connection
    .select("*")
    .from(table)
    .where(column, value)
    .then(response => {
      if (response.length !== 0) {
        return true;
      }
      return false;
    });
};
