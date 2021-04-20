const TARGET_NODE_VERSION = '12.13.0'
const TARGET_NODE_ESM_VERSION = '12.17.0'

exports.TARGET_NODE_VERSION = TARGET_NODE_VERSION

exports.babelConfigNodeBuild = {
  ast: false,
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
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-modules-commonjs'),
      { strictMode: false },
    ],
    [
      require.resolve('@babel/plugin-transform-runtime'),
      { regenerator: false },
    ],
    require.resolve('@babel/plugin-syntax-bigint'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-proposal-private-methods'),
    require.resolve('@babel/plugin-proposal-export-namespace-from'),
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
      test: /\.(ts|js)x$/,
      presets: [
        [
          require.resolve('@babel/preset-react'),
          { runtime: 'automatic' },
        ],
      ],
    },
  ],
  shouldPrintComment: (val) => val.startsWith('#') || val.startsWith('bin/sh'),
}

exports.babelConfigNodeESMBuild = {
  ast: false,
  babelrc: false,
  compact: false,
  inputSourceMap: false,
  sourceMaps: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node: TARGET_NODE_ESM_VERSION },
        ignoreBrowserslistConfig: true,
        modules: false,
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      { regenerator: false },
    ],
    require.resolve('@babel/plugin-syntax-bigint'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-proposal-private-methods'),
    require.resolve('@babel/plugin-proposal-export-namespace-from'),
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
      test: /\.(ts|js)x$/,
      presets: [
        require.resolve('@babel/preset-react'),
      ],
    },
  ],
  shouldPrintComment: (val) => val.startsWith('#') || val.startsWith('bin/sh'),
}

exports.babelConfigNodeRegister = {
  ast: false,
  babelrc: false,
  compact: false,
  inputSourceMap: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node: 'current' },
        ignoreBrowserslistConfig: true,
      },
    ],
  ],
  plugins: [
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
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  shouldPrintComment: (val) => val.startsWith('#') || val.startsWith(' istanbul'),
}
