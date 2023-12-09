const baseConfig = require("./karma.conf.base");

module.exports = (config) => {
  baseConfig(config);
  config.set({
    frameworks: ["jasmine", "webpack"],
    preprocessors: {
      "test/**/*.test.js": ["webpack"],
    },
    reporters: ["mocha"],
    files: process.env.KARMA_SPEC.split("\n"),
  });
};
