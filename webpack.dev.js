const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const configDev = merge(common, {
  mode: "development",
});

module.exports = configDev;
