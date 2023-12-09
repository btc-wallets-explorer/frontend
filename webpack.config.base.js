const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  target: "web",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["to-string-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: "assets/index.html",
    }),
  ],
  resolve: {
    fallback: {
      https: false,
      http: false,
      buffer: false,
      fs: false,
    },
  },
};
