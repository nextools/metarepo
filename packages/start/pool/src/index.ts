import path from 'path'
import { fileURLToPath } from 'url'
import { Worker } from 'worker_threads'
import { pipe } from 'funcom'
import getCallerFile from 'get-caller-file'
import { mapAsync } from 'iterama'
import { piAllAsync } from 'piall'
import type { TJsonValue } from 'typeon'
import { once } from 'wans'
import { sendAndReceiveOnWorker, sendToWorker, waitForWorker } from 'worku'
import { groupByAsync } from './group-by-async'
import { resolve } from './resolve'
import { startWithTypeAsync } from './start-with-type-async'
import type { TPipePoolOptions, TStartPoolOptions, TMessageFromWorker, TMessageToWorkerTask, TMessageToWorkerExit } from './types'
import { ungroupAsync } from './ungroup-async'

const DEFAULT_GROUP_BY = 8
const DEFAULT_GROUP_TYPE = 'serial'

let workers: Worker[] = []
const busyWorkers = new Set<number>()

export const startThreadPool = async (options: TStartPoolOptions): Promise<() => Promise<void>> => {
  const workerPath = await resolve('./worker-wrapper.mjs')

  workers = await Promise.all(
    Array.from({ length: options.threadCount }, async () => {
      const worker = new Worker(workerPath, {
        trackUnmanagedFds: true,
      })

      await waitForWorker(worker)

      return worker
    })
  )

  console.log('threads:', options.threadCount)

  return async () => {
    await Promise.all(
      workers.map((worker) => {
        sendToWorker<TMessageToWorkerExit>(worker, { type: 'EXIT' })

        return once<void>(worker, 'exit')
      })
    )
  }
}

export const pipeThreadPool = <T extends TJsonValue, R extends TJsonValue>(taskFn: (arg: any) => (it: AsyncIterable<T>) => AsyncIterable<R>, arg: TJsonValue, options?: TPipePoolOptions) => {
  if (workers.length === 0) {
    throw new Error('Start thread pool first')
  }

  const callerDir = fileURLToPath(path.dirname(getCallerFile()))
  const taskString = taskFn.toString()
  const groupBy = options?.groupBy ?? DEFAULT_GROUP_BY
  const groupType = options?.groupType ?? DEFAULT_GROUP_TYPE

  return (it: AsyncIterable<T>): AsyncIterable<R> => {
    const workerize = (group: T[]) => async (): Promise<R[]> => {
      const worker = workers.find((worker) => !busyWorkers.has(worker.threadId))!

      busyWorkers.add(worker.threadId)

      const messageFromWorker = await sendAndReceiveOnWorker<TMessageToWorkerTask, TMessageFromWorker<R[]>>(worker, {
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
