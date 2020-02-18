/* eslint-disable @typescript-eslint/no-require-imports, import/no-dynamic-require */
const Module = require('module')
const path = require('path')
const babelRegister = require('@babel/register')
const pkgDir = require('pkg-dir')
const resolve = require('resolve')

const childFile = process.argv[2]
const options = JSON.parse(process.argv[3])

const cache = new Map()

const isRelativeRequest = (value) => {
  if (value.startsWith('.')) {
    return true
  }

  if (value.startsWith(path.sep)) {
    return true
  }

  if (value.indexOf('/') >= 0) {
    return value.split('/').length > (value.startsWith('@') ? 2 : 1)
  }

  return false
}

const resolvePath = (value, basedir, { mocks, extensions, entryPointField }) => {
  if (mocks && Reflect.has(mocks, value)) {
    return mocks[value]
  }

  if (isRelativeRequest(value)) {
    try {
      const result = resolve.sync(value, { basedir, extensions })

      return result
    } catch {
      return null
    }
  }

  if (cache.has(value)) {
    return cache.get(value)
  }

  try {
    if (require.resolve(value) === value) {
      return null
    }
  } catch {
    return null
  }

  const packageDir = pkgDir.sync(
    resolve.sync(value, {
      basedir,
      extensions,
    })
  )

  if (!packageDir) {
    return null
  }

  const packageJsonPath = path.join(packageDir, 'package.json')
  const packageJson = require(packageJsonPath)

  if (typeof packageJson[entryPointField] === 'string') {
    const result = path.join(packageDir, packageJson[entryPointField])

    cache.set(value, result)

    return result
  }

  return null
}

const originalLoad = Module._load

Module._load = (value, meta, ...rest) => {
  const basedir = path.dirname(meta.filename)
  const result = resolvePath(value, basedir, options)

  if (result !== null) {
    return originalLoad(result, meta, ...rest)
  }

  return originalLoad(value, meta, ...rest)
}

global.navigator = {
  userAgent: 'x-ray',
}

const babelConfig = {
  babelrc: false,
  inputSourceMap: false,
  sourceMaps: false,
  compact: true,
  comments: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: 'current',
        },
        ignoreBrowserslistConfig: true,
        loose: true,
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
  extensions: options.extensions,
}

babelRegister(babelConfig)

require(childFile).default(options)
