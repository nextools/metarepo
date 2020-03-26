import { Worker, WorkerOptions } from 'worker_threads'

const WORKER_PATH = require.resolve('./worker')

export const BabelWorker = (filename: string, options?: WorkerOptions): Worker =>
  new Worker(WORKER_PATH, {
    ...options,
    workerData: {
      ...options?.workerData,
      __babelWorkerOriginalFile__: filename,
    },
  })
