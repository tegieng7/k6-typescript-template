module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'jsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    'jsdoc/require-description': 'error',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns': 'off',
    'prettier/prettier': 'error',
  },
};
