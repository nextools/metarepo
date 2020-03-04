import path from 'path'
import { Worker } from 'worker_threads'
import getCallerFile from 'get-caller-file'

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
  const workers = [] as Worker[]
  // not more than needed but max to maxTheadCount
  const threadCount = Math.min(Math.ceil(options.items.length / options.itemsPerThreadCount), options.maxThreadCount)
  let itemsIndex = 0

  await Promise.all(
    new Array(threadCount).fill(null).map(() => {
      return new Promise<void>((resolve, reject) => {
        let hasFailed = false
        const worker = new Worker(workerPath, {
          workerData: {
            fnFilePath: fullFnFilePath,
            fnName: options.fnName,
            fnArgs: options.fnArgs,
          },
        })

        workers.push(worker)

        worker.on('message', async ({ type, value }) => {
          switch (type) {
            case 'next': {
              if (itemsIndex >= options.items.length) {
                await worker.terminate()
              } else {
                worker.postMessage(options.items.slice(itemsIndex, itemsIndex + options.itemsPerThreadCount))
                itemsIndex += options.itemsPerThreadCount
              }

              return
            }

            case 'error': {
              hasFailed = true

              await Promise.all(workers.map((worker) => worker.terminate()))

              reject(value)

              return
            }

            case 'data': {
              options.onItemResult(value, worker.threadId)
            }
          }
        })
        worker.on('error', reject)
        worker.on('exit', () => {
          if (!hasFailed) {
            resolve()
          }
        })

        worker.postMessage(options.items.slice(itemsIndex, itemsIndex + options.itemsPerThreadCount))

        itemsIndex += options.itemsPerThreadCount
      })
    })
  )
}
