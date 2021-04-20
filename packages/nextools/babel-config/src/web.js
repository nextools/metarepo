const { browsersList } = require('@nextools/browsers-list')

exports.babelConfigWebBuild = {
  ast: false,
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
      {
        useESModules: true,
        regenerator: false,
      },
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
        [
          require.resolve('@babel/preset-react'),
          { runtime: 'automatic' },
        ],
      ],
    },
  ],
}
