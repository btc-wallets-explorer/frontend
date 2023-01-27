const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const templateParameters = require('./assets/parameters.json');

module.exports = {
  // Other rules...
  plugins: [
    new NodePolyfillPlugin(),
  ],
};

module.exports = {
  target: 'web',
  entry: {
    app: ['./src/main.js'],
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'bundle-front.js',
  },
  devtool: 'inline-source-map',
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
      templateParameters,
    }),
    new Dotenv(),
  ],

  devServer: {
    static: './dist',
    port: 9000,
  },

};
