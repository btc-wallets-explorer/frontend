const baseConfig = require("./webpack.config.base");

module.exports = {
  ...baseConfig,
};

module.exports.module.rules = [
  ...module.exports.module.rules,
  {
    test: /\.js/,
    include: /src/,
    exclude: /node_modules|\.spec\.js$/,
  },
];
