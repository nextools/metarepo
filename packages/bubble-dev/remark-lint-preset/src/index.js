exports.plugins = [
  require('remark-lint'),
  [require('remark-lint-blockquote-indentation'), 1],
  [require('remark-lint-checkbox-character-style'), { checked: 'x', unchecked: ' ' }],
]
