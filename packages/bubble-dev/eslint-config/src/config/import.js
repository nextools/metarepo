// https://github.com/benmosher/eslint-plugin-import
// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#eslint-plugin-import
module.exports = {
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts',
        '.tsx',
        '.web.ts',
        '.web.tsx',
        '.native.ts',
        '.native.tsx',
        '.ios.ts',
        '.ios.tsx',
        '.android.ts',
        '.android.tsx',
      ],
    },
    'import/ignore': [
      'typescript',
    ],
    'import/extensions': [
      '.js',
      '.ts',
      '.tsx',
      '.web.js',
      '.web.ts',
      '.web.tsx',
      '.native.js',
      '.native.ts',
      '.native.tsx',
      '.ios.js',
      '.ios.ts',
      '.ios.tsx',
      '.android.js',
      '.android.ts',
      '.android.tsx',
    ],
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.ts',
          '.tsx',
          '.web.js',
          '.web.ts',
          '.web.tsx',
          '.native.js',
          '.native.ts',
          '.native.tsx',
          '.ios.js',
          '.ios.ts',
          '.ios.tsx',
          '.android.js',
          '.android.ts',
          '.android.tsx',
        ],
      },
    },
  },
  rules: {
    'import/no-unresolved': [2, {
      ignore: [
        'worker_threads',
      ],
    }],
    'import/no-absolute-path': 2,
    'import/no-useless-path-segments': 2,
    'import/export': 2,
    'import/no-extraneous-dependencies': 2,
    'import/first': 2,
    'import/no-duplicates': 2,
    'import/extensions': [2, 'never', { json: 'always' }],
    'import/order': [2, {
      groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
    }],
  },
}
