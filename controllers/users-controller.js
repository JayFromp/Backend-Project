const fetchUserById = require("../models/users-models");
const getUserById = (req, res, next) => {
  const { username } = req.params;
  fetchUserById(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { getUserById };

console.log(Date.now(1527695953341));
