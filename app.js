const express = require("express");
const apiRouter = require("./routers/api-router");
const cors = require("cors");

const { customErrors, psqlErrors, badPath } = require("./errors");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/*", badPath);

app.use(customErrors);
app.use(psqlErrors);

module.exports = { app };
