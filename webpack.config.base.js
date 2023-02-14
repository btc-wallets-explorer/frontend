const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const templateParameters = require('./assets/parameters.json');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
      templateParameters,
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
