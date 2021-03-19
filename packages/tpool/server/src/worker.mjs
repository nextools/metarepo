import { parentPort } from 'worker_threads'
import { transformAsync } from '@babel/core'
import babelPresetEnv from '@babel/preset-env'
import { toArrayAsync } from 'iterama'
import { once } from 'wans'
import babelPluginImports from './babel-plugin.mjs'

const cache = new Map()

while (true) {
  try {
    const { arg, fnString, callerDir, groupBy, groupType } = await once(parentPort, 'message')
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

    let value

    const getValue = async (i) => {
      const it = await fn({
        async *[Symbol.asyncIterator]() {
          yield i
        },
      })
      const iterator = it[Symbol.asyncIterator]()
      const result = await iterator.next()

      return result.value
    }

    if (groupBy === 1) {
      value = [await getValue(arg[0])]
    } else if (groupBy > 1 && groupType === 'serial') {
      value = await toArrayAsync(await fn(arg))
    } else if (groupBy > 1 && groupType === 'concurrent') {
      value = [
        await getValue(arg[0]),
        ...await Promise.all(
          arg.slice(1).map(getValue)
        ),
      ]
    } else {
      throw new Error(`Invalid pool options: ${poolOptions}`)
    }

    parentPort.postMessage({
      type: 'DONE',
      value,
    })
  } catch (err) {
    parentPort.postMessage({
      type: 'ERROR',
      value: err.stack ?? err,
    })
  }
}
