module.exports = (src) => [
  src,
  'require(\'react-native\').AppRegistry.registerComponent(\'rebox\', () => App)',
].join('\n')
