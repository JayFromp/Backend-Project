const { fetchEndPoints } = require("../models/endpoints-model");

const getEndPoints = (req, res, next) => {
  fetchEndPoints().then(endpoints => {
    res.status(200).send({ endpoints });
  });
};

module.exports = { getEndPoints };
