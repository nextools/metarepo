import path from 'path'
import { Worker } from 'worker_threads'
import getCallerFile from 'get-caller-file'
import { piAll } from 'piall'

export type TWorkerama = {
  items: any[],
  itemsPerThreadCount: number,
  maxThreadCount: number,
  fnFilePath: string,
  fnName: string,
  fnArgs: any[],
  onItemResult: (result: any, workerId: number) => void,
}

export const workerama = async (options: TWorkerama): Promise<void> => {
  if (options.itemsPerThreadCount <= 0) {
    throw new Error('`itemsPerThreadCount` should be greater than zero')
  }

  if (options.maxThreadCount <= 0) {
    throw new Error('`maxThreadCount` should be greater than zero (tip: pass Infinity to set no limits)')
  }

  const workerPath = require.resolve('./worker')
  const callerDir = path.dirname(getCallerFile())
  const fullFnFilePath = require.resolve(path.resolve(callerDir, options.fnFilePath))
  // not more than needed but max to maxTheadCount
  const threadCount = Math.min(Math.ceil(options.items.length / options.itemsPerThreadCount), options.maxThreadCount)

  const workers = Array.from({ length: threadCount }, () => {
    return new Worker(workerPath, {
      workerData: {
        fnFilePath: fullFnFilePath,
        fnName: options.fnName,
        fnArgs: options.fnArgs,
      },
    })
  })

  const resultsIterable = piAll(
    options.items.map((item) => () => {
      const worker = workers.shift()!

      return new Promise((resolve, reject) => {
        worker
          .once('error', reject)
          .on('message', (message) => {
            worker.removeAllListeners()
            workers.push(worker)

            if (message.type === 'done') {
              resolve(message.value)
            } else if (message.type === 'error') {
              reject(message.value)
            }
          })
          .postMessage(item)
      })
    }),
    threadCount
  )

  for await (const result of resultsIterable) {
    options.onItemResult(result, 0)
  }

  await Promise.all(workers.map((worker) => worker.terminate()))
}
