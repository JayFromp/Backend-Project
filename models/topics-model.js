const connection = require("../db/utils/connection");

const fetchTopics = () => {
  return connection.select("*").from("topics");
};

module.exports = fetchTopics;
