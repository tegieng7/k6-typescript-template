module.exports = {
  printWidth: 120,
  proseWrap: 'preserve',
  semi: true,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  arrowParens: 'avoid',
  trailingComma: 'es5',
  overrides: [
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
    {
      files: '*.ts',
      options: {
        parser: 'typescript',
      },
    },
  ],
};
