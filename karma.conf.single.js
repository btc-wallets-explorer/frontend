const baseConfig = require('./karma.conf');

module.exports = (config) => {
  baseConfig(config);
  config.set({
    files: [
      process.env.KARMA_SPEC,
    ],
  });
};
