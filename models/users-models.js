const connection = require("../db/utils/connection");

const fetchUserById = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then(user => {
      if (!user.length) {
        return Promise.reject({ status: 400, msg: "username does not exist" });
      }
      return user;
    });
};

module.exports = fetchUserById;
