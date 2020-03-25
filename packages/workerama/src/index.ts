import path from 'path'
import { Worker } from 'worker_threads'
import getCallerFile from 'get-caller-file'
import { piAll } from 'piall'
import { iterableFinally, iterableMap } from './iterable'

type TMessage = {
  type: 'done' | 'error',
  value: any,
}

export type TWorkeramaOptions = {
  items: any[],
  maxThreadCount: number,
  fnFilePath: string,
  fnName: string,
  fnArgs: any[],
}

export const workerama = <T>(options: TWorkeramaOptions): AsyncIterable<T> => {
  if (options.maxThreadCount <= 0) {
    throw new Error('`maxThreadCount` should be greater than zero (tip: pass Infinity to set no limits)')
  }

  const umask = process.umask()
  const workerPath = require.resolve('./worker')
  const callerDir = path.dirname(getCallerFile())
  const fullFnFilePath = require.resolve(path.resolve(callerDir, options.fnFilePath))
  // not more than needed but max to maxTheadCount
  const threadCount = Math.min(options.items.length, options.maxThreadCount)

  const workers = Array.from({ length: threadCount }, () => {
    return new Worker(workerPath, {
      workerData: {
        fnFilePath: fullFnFilePath,
        fnName: options.fnName,
        fnArgs: options.fnArgs,
        // https://github.com/nodejs/node/issues/25448
        // https://github.com/nodejs/node/pull/25526
        umask,
      },
    })
  })
  const busyWorkerIds = new Set<number>()

  const resultsIterable = iterableFinally(
    piAll(
      iterableMap((item) => () => {
        const worker = workers.find(({ threadId }) => !busyWorkerIds.has(threadId))!

        busyWorkerIds.add(worker.threadId)

        return new Promise<T>((resolve, reject) => {
          worker
            .on('error', reject)
            .on('message', (message: TMessage) => {
              worker.removeAllListeners('error')
              worker.removeAllListeners('message')

              busyWorkerIds.delete(worker.threadId)

              if (message.type === 'done') {
                resolve(message.value)
              /* istanbul ignore else */
              } else if (message.type === 'error') {
                reject(message.value)
              }
            })
            .postMessage(item)
        })
      }, options.items),
      threadCount
    ),
    () => piAll(
      iterableMap((worker) => () => worker.terminate(), workers)
    )
  )

  return resultsIterable
}
