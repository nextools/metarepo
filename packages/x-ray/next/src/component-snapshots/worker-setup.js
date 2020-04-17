require('@babel/register')({
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
  extensions: [
    '.web.ts',
    '.ts',
    '.web.tsx',
    '.tsx',
    '.web.js',
    '.js',
    '.web.jsx',
    '.jsx',
  ],
})

const path = require('path')
const Module = require('module')
const resolver = require('enhanced-resolve')

const originalLoad = Module._load
const cache = new Map()

const resolve = resolver.create.sync({
  mainFields: ['browser', 'main'],
  unsafeCache: true,
})

Module._load = (request, parent, isMain) => {
  if (!request.startsWith('.') && !path.isAbsolute(request) && !Module.builtinModules.includes(request)) {
    const callerDir = path.dirname(parent.filename)
    const cacheKey = `${callerDir}@${request}`

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const resolvedPath = resolve(callerDir, request)
    const result = originalLoad(resolvedPath, parent, isMain)

    cache.set(cacheKey, result)

    return result
  }

  return originalLoad(request, parent, isMain)
}

module.exports = require('./worker')
