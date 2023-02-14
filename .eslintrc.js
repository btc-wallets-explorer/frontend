module.exports = {
  env: {
    node: true,
    browser: true,
    jasmine: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  rules: {
    'import/prefer-default-export': 'off',
  },
};
