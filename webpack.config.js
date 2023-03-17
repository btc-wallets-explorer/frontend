const path = require('path');
const baseConfig = require('./webpack.config.base');

module.exports = {
  entry: {
    config: ['./assets/config.js'],
    app: ['./src/main.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  watch: false,
  devServer: {
    static: './dist',
    port: 9000,
  },
  ...baseConfig,
};
