const TARGET_NODE_VERSION = '10.13.0'

exports.TARGET_NODE_VERSION = TARGET_NODE_VERSION

exports.babelConfigNodeBuild = {
  babelrc: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node: TARGET_NODE_VERSION },
        ignoreBrowserslistConfig: true,
        exclude: [
          '@babel/plugin-transform-regenerator',
          '@babel/plugin-transform-async-to-generator',
        ],
      },
    ],
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-typescript'),
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      { regenerator: false },
    ],
    require.resolve('@babel/plugin-syntax-bigint'),
    [
      require.resolve('babel-plugin-transform-inline-environment-variables'),
      {
        include: ['BABEL_ENV'],
      },
    ],
  ],
  shouldPrintComment: (val) => val.startsWith('#'),
  sourceMaps: false,
}

exports.babelConfigNodeRegister = {
  babelrc: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node: 'current' },
        ignoreBrowserslistConfig: true,
        exclude: [
          '@babel/plugin-transform-regenerator',
          '@babel/plugin-transform-async-to-generator',
        ],
      },
    ],
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-typescript'),
  ],
  plugins: [
    require.resolve('@babel/plugin-syntax-bigint'),
  ],
  extensions: ['.ts', '.tsx', '.js'],
}
