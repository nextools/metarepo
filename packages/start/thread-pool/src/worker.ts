import { parentPort } from 'worker_threads'
import { transformAsync } from '@babel/core'
// @ts-ignore
import babelPresetEnv from '@babel/preset-env'
import { pipe } from 'funcom'
import { map, toArrayAsync } from 'iterama'
import type { TJsonValue } from 'typeon'
import { receiveOnPort, sendToPort } from 'worku'
// @ts-ignore
import babelPluginImports from './babel-plugin.mjs'
import type { TMessageFromWorkerDone, TMessageFromWorkerError, TMessageToWorker } from './types'

const cache = new Map()

while (true) {
  try {
    const message = await receiveOnPort<TMessageToWorker<TJsonValue[]>>(parentPort!)

    if (message.type === 'EXIT') {
      break
    }

    const { group, args, taskString, callerDir, groupBy, groupType } = message.value
    const cacheKey = `${callerDir}@${taskString}}`

    let task: (it: AsyncIterable<TJsonValue>) => AsyncIterableIterator<TJsonValue>

    if (cache.has(cacheKey)) {
      task = cache.get(cacheKey)
    } else {
      const transformed = await transformAsync(taskString, {
        babelrc: false,
        compact: true,
        // @ts-expect-error
        targets: { node: 'current' },
        presets: [
          [
            babelPresetEnv,
            {
              shippedProposals: true,
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
      task = new Function(`return ${transformed.code}`)()(...args)

      cache.set(cacheKey, task)
    }

    let value: TJsonValue[]

    const getValue = pipe(
      (i: TJsonValue) => ({
        async *[Symbol.asyncIterator]() {
          yield i
        },
      }),
      task,
      toArrayAsync
    )

    const getValues = pipe(
      (i: TJsonValue[]) => ({
        async *[Symbol.asyncIterator]() {
          yield* i
        },
      }),
      task,
      toArrayAsync
    )

    if (groupBy === 1) {
      value = await getValues(group)
    } else if (groupBy > 1 && groupType === 'serial') {
      value = await getValues(group)
    } else if (groupBy > 1 && groupType === 'concurrent') {
      value = await Promise.all(map(getValue)(group))
      value = value.flat()
    } else {
      throw new Error('Invalid pool options')
    }

    sendToPort<TMessageFromWorkerDone<TJsonValue[]>>(parentPort!, {
      type: 'DONE',
      value,
    })
  } catch (err) {
    // direct V8 serialization of Error instances looses colors
    // for example in Babel syntax errors
    if (err instanceof Error) {
      sendToPort<TMessageFromWorkerError>(parentPort!, {
        type: 'ERROR',
        value: {
          message: err.message,
          stack: err.stack,
        },
      })
    } else {
      sendToPort<TMessageFromWorkerError>(parentPort!, {
        type: 'ERROR',
        value: err,
      })
    }
  }
}
