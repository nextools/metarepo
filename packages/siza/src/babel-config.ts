const browsers = ['last 1 Chrome version']

export const babelConfig = {
  babelrc: false,
  inputSourceMap: null,
  sourceMaps: false,
  compact: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { browsers },
        modules: false,
      },
    ],
    require.resolve('@babel/preset-typescript'),
    [
      require.resolve('@babel/preset-react'),
      { runtime: 'automatic' },
    ],
  ],
  plugins: [
    [
      require.resolve('babel-plugin-polyfill-corejs3'),
      {
        method: 'usage-global',
        targets: { browsers },
      },
    ],
    require.resolve('@babel/plugin-transform-runtime'),
  ],
}
