const Env = process.env.NODE_ENV || "development";
const devData = require("../data/development-data");
const testData = require("../data/test-data");

const data = { production: devData, development: devData, test: testData };

module.exports = data[Env];
