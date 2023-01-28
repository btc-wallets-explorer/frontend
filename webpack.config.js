const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const templateParameters = require('./assets/parameters.json');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: {
    app: ['./src/main.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle-front.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'to-string-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            },
          }],
      }],
  },
  devtool: 'inline-source-map',
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
      templateParameters,
    }),
  ],

  watch: false,
  devServer: {
    static: './dist',
    port: 9000,
  },
  resolve: {
    fallback: {
      https: false,
      http: false,
      buffer: false,
      fs: false,
    },
  },

};
