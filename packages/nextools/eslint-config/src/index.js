module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'import',
    'node',
  ],
  extends: [
    require.resolve('./config/core'),
    require.resolve('./config/import'),
    require.resolve('./config/node'),
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      plugins: [
        '@typescript-eslint',
      ],
      extends: [
        require.resolve('./config/typescript'),
      ],
    },
    {
      files: ['*.tsx', '*.jsx'],
      plugins: [
        'react',
      ],
      extends: [
        require.resolve('./config/react'),
      ],
    },
  ],
  globals: {
    BigInt: 'readonly',
  },
}
