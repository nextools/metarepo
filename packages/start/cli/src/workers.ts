import { cpus } from 'os'
import { Worker } from 'worker_threads'
import { mapAsync } from 'iterama'
import { piAllAsync } from 'piall'
import { once } from 'wans'
import { resolve } from './resolve'

export const getWorkers = async (tasksFilePath: string): Promise<Worker[]> => {
  const workerPath = await resolve('./worker.mjs')
  const workerCount = cpus().length

  const workers = await Promise.all(
    Array.from({ length: workerCount }, async () => {
      const worker = new Worker(workerPath, {
        workerData: {
          tasksFilePath,
        },
      })

      await once(worker, 'online')

      return worker
    })
  )

  return workers
}

export const workerify = <T>(workers: Worker[]) => (taskName: string) => (it: AsyncIterable<T>): AsyncIterable<T> => {
  const busyWorkers = new Set<number>()
  const mapper = (value: T) => async (): Promise<T> => {
    const worker = workers.find(({ threadId }) => !busyWorkers.has(threadId))!

    busyWorkers.add(worker.threadId)

    worker.postMessage({
      taskName,
      value,
    })

    await once(worker, 'message')

    busyWorkers.delete(worker.threadId)

    return value
  }
  const mapped = mapAsync(mapper)(it)

  return piAllAsync(mapped, workers.length)
}
