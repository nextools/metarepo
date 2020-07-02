import path from 'path'
// eslint-disable-next-line import/order
import { Worker } from 'worker_threads'
import getCallerFile from 'get-caller-file'
import { map } from 'iterama'
import { piAll } from 'piall'
import { asyncIterableFinally } from './async-iterable-finally'

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

  // @ts-ignore
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

  const resultsIterable = asyncIterableFinally(
    piAll(
      map((item: any) => () => {
        const worker = workers.find(({ threadId }) => !busyWorkerIds.has(threadId))!

        busyWorkerIds.add(worker.threadId)

        return new Promise<T>((resolve, reject) => {
          worker
            .on('error', reject)
            .on('message', (message: TMessage) => {
              worker.removeAllListeners('error')
              worker.removeAllListeners('message')

              busyWorkerIds.delete(worker.threadId)

              /* istanbul ignore else */
              if (message.type === 'done') {
                resolve(message.value)
              } else if (message.type === 'error') {
                reject(message.value)
              }
            })
            .postMessage({ value: item })
        })
      })(options.items),
      threadCount
    ),
    () => piAll(
      map((worker: Worker) => () => {
        return new Promise((resolve) => {
          worker
            .on('exit', resolve)
            .postMessage({ done: true })
        })
      })(workers)
    )
  )

  return resultsIterable
}
