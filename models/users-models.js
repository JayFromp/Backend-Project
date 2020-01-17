const connection = require("../db/utils/connection");

const fetchUserById = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then(user => {
      if (!user.length) {
        return Promise.reject({ status: 404, msg: "username does not exist" });
      }
      return user[0];
    });
};

module.exports = fetchUserById;
