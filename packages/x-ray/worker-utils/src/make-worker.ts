import { Worker } from 'worker_threads'
import { TAnyObject } from 'tsfn'

const setupFile = require.resolve('./setup')

export const makeWorker = (childFile: string, options: TAnyObject): Worker =>
  new Worker(setupFile, {
    workerData: {
      childFile,
      options,
    },
  })
