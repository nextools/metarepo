export const babelConfig = {
  babelrc: false,
  inputSourceMap: null,
  sourceMaps: false,
  compact: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { browsers: ['last 1 Chrome version'] },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    require.resolve('@babel/preset-typescript'),
    [
      require.resolve('@babel/preset-react'),
      { runtime: 'automatic' },
    ],
  ],
  plugins: [
    require.resolve('@babel/plugin-transform-runtime'),
  ],
}
