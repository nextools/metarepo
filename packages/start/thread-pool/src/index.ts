import path from 'path'
import { fileURLToPath } from 'url'
import { Worker } from 'worker_threads'
import { pipe } from 'funcom'
import getCallerFile from 'get-caller-file'
import { groupByAsync, map, mapAsync, range, ungroupAsync } from 'iterama'
import { piAllAsync } from 'piall'
import type { TJsonValue } from 'typeon'
import { once } from 'wans'
import { sendAndReceiveOnWorker, sendToWorker, waitForWorker } from 'worku'
import { resolve } from './resolve'
import { startWithTypeAsync } from './start-with-type-async'
import type { TPipePoolOptions, TStartPoolOptions, TMessageFromWorker, TMessageToWorkerTask, TMessageToWorkerExit } from './types'

const DEFAULT_GROUP_BY = 1
const DEFAULT_GROUP_TYPE = 'serial'

let workers: Worker[] = []
const busyWorkers = new Set<number>()
const queueResolvers: (() => void)[] = []

export const startThreadPool = async (options: TStartPoolOptions): Promise<() => Promise<void>> => {
  const workerPath = await resolve('./worker-wrapper.mjs')

  workers = await Promise.all(
    map(async () => {
      const worker = new Worker(workerPath, {
        trackUnmanagedFds: true,
      })

      await waitForWorker(worker)

      return worker
    })(range(options.threadCount))
  )

  return async () => {
    await Promise.all(
      map((worker: Worker) => {
        sendToWorker<TMessageToWorkerExit>(worker, { type: 'EXIT' })

        return once<void>(worker, 'exit')
      })(workers)
    )
  }
}

export const mapThreadPool = <T, R>(taskFn: (arg: any) => (it: AsyncIterable<T>) => AsyncIterable<R>, arg: TJsonValue, options?: TPipePoolOptions) => {
  if (workers.length === 0) {
    throw new Error('Start thread pool first')
  }

  const taskString = taskFn.toString()
  const callerDir = fileURLToPath(path.dirname(getCallerFile()))
  const groupBy = options?.groupBy ?? DEFAULT_GROUP_BY
  const groupType = options?.groupType ?? DEFAULT_GROUP_TYPE

  return (it: AsyncIterable<T>): AsyncIterable<R> => {
    const workerize = async (group: T[]): Promise<R[]> => {
      if (busyWorkers.size === workers.length) {
        await new Promise<void>((resolve) => {
          queueResolvers.push(resolve)
        })
      }

      const worker = workers.find((worker) => !busyWorkers.has(worker.threadId))!

      busyWorkers.add(worker.threadId)

      const messageFromWorker = await sendAndReceiveOnWorker<TMessageToWorkerTask<T[]>, TMessageFromWorker<R[]>>(worker, {
        type: 'TASK',
        value: {
          taskString,
          arg,
          callerDir,
          group,
          groupBy,
          groupType,
        },
      })

      busyWorkers.delete(worker.threadId)

      if (queueResolvers.length > 0) {
        const queueResolver = queueResolvers.shift()!

        queueResolver()
      }

      if (messageFromWorker.type === 'ERROR') {
        throw messageFromWorker.value
      }

      return messageFromWorker.value
    }

    return pipe(
      startWithTypeAsync<T>(),
      groupByAsync(groupBy),
      mapAsync(workerize),
      piAllAsync(workers.length),
      ungroupAsync
    )(it)
  }
}
