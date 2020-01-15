const express = require("express");
const apiRouter = require("./routers/api-router");
const { customErrors, psqlErrors } = require("./errors");
const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrors);
app.use(psqlErrors);

module.exports = { app };
