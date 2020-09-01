module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'import',
    'node',
    'react',
    '@typescript-eslint',
  ],
  extends: [
    require.resolve('./config/core'),
    require.resolve('./config/import'),
    require.resolve('./config/node'),
    require.resolve('./config/react'),
    require.resolve('./config/typescript'),
  ],
  globals: {
    BigInt: 'readonly',
  },
}
