const TARGET_NODE_VERSION = '10.13.0'

exports.TARGET_NODE_VERSION = TARGET_NODE_VERSION

exports.babelConfigNodeBuild = {
  babelrc: false,
  compact: false,
  inputSourceMap: false,
  sourceMaps: false,
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
  overrides: [
    {
      test: /\.(ts|tsx)$/,
      presets: [
        require.resolve('@babel/preset-typescript'),
      ],
    },
    {
      test: /\.tsx$/,
      presets: [
        require.resolve('@babel/preset-react'),
      ],
    },
  ],
  shouldPrintComment: (val) => val.startsWith('#'),
}

exports.babelConfigNodeRegister = {
  babelrc: false,
  compact: false,
  inputSourceMap: false,
  sourceMaps: 'inline',
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
  ],
  plugins: [
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
      test: /\.tsx$/,
      presets: [
        require.resolve('@babel/preset-react'),
      ],
    },
  ],
  extensions: ['.ts', '.tsx', '.js'],
  shouldPrintComment: (val) => val.startsWith('#'),
}
