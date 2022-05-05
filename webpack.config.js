const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDev ? "development" : "production",
  target: "web",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  devtool: isDev ? "source-map" : false,
};
