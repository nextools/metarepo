const { browsersList } = require('@nextools/browsers-list')

exports.babelConfigWebBuild = {
  babelrc: false,
  inputSourceMap: false,
  sourceMaps: true,
  compact: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { browsers: browsersList },
        ignoreBrowserslistConfig: true,
        modules: false,
        exclude: [
          '@babel/plugin-transform-regenerator',
          '@babel/plugin-transform-async-to-generator',
        ],
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      { regenerator: false },
    ],
    require.resolve('@babel/plugin-syntax-bigint'),
  ],
  overrides: [
    {
      test: /\.(ts|tsx)$/,
      presets: [
        require.resolve('@babel/preset-typescript'),
      ],
    },
    {
      test: /\.(ts|js)x$/,
      presets: [
        require.resolve('@babel/preset-react'),
      ],
    },
  ],
}
