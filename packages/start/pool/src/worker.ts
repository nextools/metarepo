import { parentPort } from 'worker_threads'
import { transformAsync } from '@babel/core'
// @ts-ignore
import babelPresetEnv from '@babel/preset-env'
import { pipeAsync } from 'funcom'
import { toArrayAsync } from 'iterama'
import type { TJsonValue } from 'typeon'
import { receiveOnPort, sendToPort } from 'worku'
// @ts-ignore
import babelPluginImports from './babel-plugin.mjs'
import type { TMessageFromWorkerDone, TMessageFromWorkerError, TMessageToWorker } from './types'

const cache = new Map()

while (true) {
  try {
    const message = await receiveOnPort<TMessageToWorker>(parentPort!)

    if (message.type === 'EXIT') {
      break
    }

    const { group, arg, taskString, callerDir, groupBy, groupType } = message.value
    const cacheKey = `${callerDir}@${String}}`
    let fn: (it: AsyncIterable<any>) => Promise<AsyncIterable<any[]>>

    if (cache.has(cacheKey)) {
      fn = cache.get(cacheKey)
    } else {
      const transformed = await transformAsync(taskString, {
        ast: false,
        babelrc: false,
        compact: true,
        // Error: .inputSourceMap must be a boolean, object, or undefined
        // @ts-ignore
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

      if (transformed === null) {
        throw new Error('Transpiled code is empty')
      }

      // eslint-disable-next-line no-new-func
      fn = new Function(`return ${transformed.code}`)()(arg)

      cache.set(cacheKey, fn)
    }

    let value: TJsonValue[]

    const getValue = async (i: TJsonValue) => {
      const it = await fn({
        async *[Symbol.asyncIterator]() {
          yield i
        },
      })

      const iterator = it[Symbol.asyncIterator]()
      const result = await iterator.next()

      return result.value
    }

    const getValues = pipeAsync(
      (i: TJsonValue[]) => ({
        async *[Symbol.asyncIterator]() {
          yield* i
        },
      }),
      fn,
      toArrayAsync
    )

    if (groupBy === 1) {
      value = await getValues(group)
    } else if (groupBy > 1 && groupType === 'serial') {
      value = await getValues(group)
    } else if (groupBy > 1 && groupType === 'concurrent') {
      value = await Promise.all(group.map(getValue))
    } else {
      throw new Error('Invalid pool options')
    }

    sendToPort<TMessageFromWorkerDone<TJsonValue[]>>(parentPort!, {
      type: 'DONE',
      value,
    })
  } catch (err) {
    sendToPort<TMessageFromWorkerError>(parentPort!, {
      type: 'ERROR',
      value: err.stack ?? err,
    })
  }
}
