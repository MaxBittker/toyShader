var path = require("path");
module.exports = {
  entry:['./index.js'],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/build/",
    filename: "bundle.js"
  }
};
