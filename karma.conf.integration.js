const baseConfig = require('./karma.conf');

module.exports = (config) => {
  baseConfig(config);
  config.set({
    preprocessors: {
      'test/integration/**/*.test.js': ['webpack'],
    },
    files: [
      { pattern: 'test/integration/**/*.test.js' },
    ],
  });
};
