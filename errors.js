const badPath = (req, res, next) => {
  res.status(400).send({ msg: "Page Not Found" });
};

const badMethod = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

const customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

const psqlErrors = (err, req, res, next) => {
  if (err.code) {
    const errorRef = {
      "22P02": [400, "Sorry, invalid data type given"]
    };
    const [status, message] = errorRef[err.code];
    res.status(status).send({ msg: message });
  }
};

module.exports = { badPath, badMethod, customErrors, psqlErrors };
