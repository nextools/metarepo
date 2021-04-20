exports.babelConfigReactNativeBuild = {
  ast: false,
  babelrc: false,
  compact: false,
  inputSourceMap: false,
  sourceMaps: true,
  presets: [
    require.resolve('metro-react-native-babel-preset'),
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-react-jsx'),
      { runtime: 'automatic' },
    ],
    [
      require.resolve('@babel/plugin-transform-runtime'),
      { regenerator: false },
    ],
    [
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      {
        useBuiltIns: true,
        loose: true,
      },
    ],
    [
      require.resolve('@babel/plugin-transform-destructuring'),
      {
        useBuiltIns: true,
      },
    ],
    require.resolve('@babel/plugin-syntax-bigint'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-proposal-private-methods'),
    require.resolve('@babel/plugin-proposal-export-namespace-from'),
  ],
}
