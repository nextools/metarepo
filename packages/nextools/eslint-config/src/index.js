module.exports = {
  extends: [
    require.resolve('./config/core'),
    require.resolve('./config/import'),
    require.resolve('./config/node'),
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        require.resolve('./config/typescript'),
      ],
    },
    {
      files: ['*.tsx', '*.jsx'],
      extends: [
        require.resolve('./config/react'),
      ],
    },
  ],
}
