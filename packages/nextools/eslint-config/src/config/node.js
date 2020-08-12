// https://github.com/mysticatea/eslint-plugin-node
module.exports = {
  rules: {
    'node/handle-callback-err': 2,
    'node/no-deprecated-api': [2, {
      version: '>=12.13.0',
    }],
    'node/no-extraneous-require': 2,
    'node/no-path-concat': 2,
    'node/no-sync': 2,
  },
}
