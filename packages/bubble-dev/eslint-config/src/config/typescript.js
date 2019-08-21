/* eslint-disable import/no-commonjs */

// https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
module.exports = {
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 2,
    '@typescript-eslint/array-type': [2, 'array'],
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/indent': [2, 2, {
      ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild', 'TSIntersectionType'],
      SwitchCase: 1,
    }],
    '@typescript-eslint/member-delimiter-style': [2, {
      multiline: {
        delimiter: 'comma',
        requireLast: true,
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false,
      },
    }],
    '@typescript-eslint/no-namespace': 2,
    '@typescript-eslint/no-triple-slash-reference': 2,
  },
}
