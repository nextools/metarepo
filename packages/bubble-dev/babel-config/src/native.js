const babelPresetReactNative = require('metro-react-native-babel-preset')

const babelPresetReactNativeNoCompact = (...args) => ({
  ...babelPresetReactNative(...args),
  compact: false,
})

exports.babelConfigReactNative = {
  babelrc: false,
  sourceMaps: true,
  presets: [babelPresetReactNativeNoCompact],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      { regenerator: false },
    ],
    require.resolve('@babel/plugin-syntax-bigint'),
  ],
}
