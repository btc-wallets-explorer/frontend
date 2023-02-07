const baseConfig = require('./karma.conf');

module.exports = (config) => {
  baseConfig(config);
  config.set({
    frameworks: ['jasmine', 'webpack'],
    preprocessors: {
      'test/**/*.test.js': ['webpack'],
    },
    reporters: ['mocha', 'verbose', 'coverage-istanbul'],
    files: [
      process.env.KARMA_SPEC,
    ],
  });
};
