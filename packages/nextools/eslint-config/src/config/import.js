// https://github.com/benmosher/eslint-plugin-import
// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#eslint-plugin-import
module.exports = {
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts',
        '.tsx',
      ],
    },
    'import/extensions': [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
    ],
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {
        extensions: [
          '.js',
          '.jsx',
        ],
      },
    },
  },
  rules: {
    'import/no-unresolved': 2,
    'import/no-absolute-path': 2,
    'import/no-useless-path-segments': 2,
    'import/export': 2,
    'import/no-extraneous-dependencies': 2,
    'import/first': 2,
    'import/no-duplicates': 2,
    // 'import/extensions': [2, 'never', { json: 'always' }],
    'import/order': [2, {
      alphabetize: {
        order: 'asc',
        caseInsensitive: false,
      },
      groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
    }],
  },
}
