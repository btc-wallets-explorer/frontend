const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const templateParameters = require('./assets/parameters.json');

module.exports = {
  target: 'web',
  entry: {
    app: ['./frontend/main.js'],
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'bundle-front.js',
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'frontend/index.html',
      templateParameters,
    }),
    new Dotenv(),
  ],

};
