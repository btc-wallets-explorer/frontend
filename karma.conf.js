const webpackConfig = require('./webpack.config.base');

module.exports = (config) => {
  config.set({
    frameworks: ['jasmine', 'webpack', 'iframes'],
    files: [
      { pattern: 'test/unit/**/*.test.js' },
    ],
    exclude: [
    ],
    preprocessors: {
      'test/unit/**/*.test.js': ['webpack', 'iframes'],
    },
    reporters: ['progress', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.INFO,
    autoWatch: true,

    browsers: [
      'ChromeDebugging',
    ],

    customLaunchers: {
      ChromeDebugging: {
        base: 'ChromeHeadless',
        flags: ['--remote-debugging-port=9333'],
      },
    },
    singleRun: false,
    concurrency: Infinity,
    webpack: webpackConfig,

    browserConsoleLogOptions: {
      level: 'debug',
      format: '%b %T: %m',
      terminal: true,
      path: 'console.log',
    },
  });
};
