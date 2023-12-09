const baseConfig = require("./karma.conf.base");

module.exports = (config) => {
  baseConfig(config);
  config.set({
    frameworks: ["jasmine", "webpack", "iframes"],
    preprocessors: {
      "test/unit/**/*.test.js": ["webpack", "iframes"],
    },
    files: [{ pattern: "test/unit/**/*.test.js" }],
  });
};
