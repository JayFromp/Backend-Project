const { fetchUserById, fetchUsers } = require("../models/users-models");

const getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .then(err => {
      next(err);
    });
};

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

module.exports = { getUserById, getUsers };
