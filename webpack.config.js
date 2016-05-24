var path = require("path");
module.exports = {
  entry:['webpack/hot/dev-server', './index.js'],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/build/",
    filename: "bundle.js"
  }
};
