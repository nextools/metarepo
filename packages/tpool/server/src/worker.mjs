import { parentPort } from 'worker_threads'
import { transformAsync } from '@babel/core'
import babelPresetEnv from '@babel/preset-env'
import { once } from 'wans'
import babelPluginImports from './babel-plugin.mjs'

const cache = new Map()

while (true) {
  try {
    const { arg, fnString, callerDir } = await once(parentPort, 'message')
    const cacheKey = `${callerDir}@${fnString}}`
    let fn

    if (cache.has(cacheKey)) {
      fn = cache.get(cacheKey)
    } else {
      const transformed = await transformAsync(fnString, {
        ast: false,
        babelrc: false,
        compact: true,
        inputSourceMap: false,
        presets: [
          [
            babelPresetEnv,
            {
              targets: { node: 'current' },
              ignoreBrowserslistConfig: true,
              modules: false,
            },
          ],
        ],
        plugins: [
          [
            babelPluginImports,
            { callerDir },
          ],
        ],
      })

      // eslint-disable-next-line no-new-func
      fn = new Function(`return ${transformed.code}`)()

      cache.set(cacheKey, fn)
    }

    const it = await fn({
      async *[Symbol.asyncIterator]() {
        yield arg
      },
    })
    const iterator = it[Symbol.asyncIterator]()
    const result = await iterator.next()

    parentPort.postMessage({
      type: 'DONE',
      value: result.value,
    })
  } catch (err) {
    parentPort.postMessage({
      type: 'ERROR',
      value: err.stack ?? err,
    })
  }
}
