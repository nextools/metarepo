// hard-forked from https://github.com/callstack/haul/blob/master/packages/haul-preset-0.60/src/index.ts

const { withPolyfillsFactory, makeConfigFactory } = require('@haul-bundler/core')
const getDefaultConfig = require('./defaultConfig')

function resolvePolyfill(name) {
  const filename = `@react-native/polyfills/${name}.js`
  const searchPaths = [...module.paths, process.cwd()]

  try {
    return require.resolve(filename, { paths: searchPaths })
  } catch (e) {
    throw new Error(
      `Cannot resolve '${filename}' in [${searchPaths.join(
        ', '
      )}]'. Please make sure you have 'react-native' installed.`
    )
  }
}

const polyfills = [
  resolvePolyfill('console'),
  resolvePolyfill('error-guard'),
  resolvePolyfill('Object.es7'),
]

exports.withPolyfills = withPolyfillsFactory(polyfills)
exports.makeConfig = makeConfigFactory(getDefaultConfig)
