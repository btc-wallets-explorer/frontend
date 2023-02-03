const path = require('path');
const baseConfig = require('./webpack.config.base');

module.exports = {
  entry: {
    app: ['./src/main.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle-front.js',
    clean: true,
  },
  watch: false,
  devServer: {
    static: './dist',
    port: 9000,
  },
  ...baseConfig,
};
