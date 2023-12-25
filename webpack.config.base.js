const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  target: "web",
  experiments: {
    asyncWebAssembly: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["to-string-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
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
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      https: false,
      http: false,
      buffer: false,
      fs: false,
    },
  },
};
