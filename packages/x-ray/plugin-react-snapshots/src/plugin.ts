import { workerama } from 'workerama'
import { forEachAsync, toMapAsync } from 'iterama'
import { pipe } from 'funcom'
import { TPlugin } from '@x-ray/core'
import { TWorkerResult } from './types'
import { MAX_THREAD_COUNT, WORKER_PATH } from './constants'

export const reactSnapshots = (): TPlugin<string> => ({
  name: 'react-snapshots',
  encoding: 'text',
  getResults: (files) => {
    const totalResultsIterable = workerama<TWorkerResult<string>>({
      items: files,
      maxThreadCount: MAX_THREAD_COUNT,
      fnFilePath: WORKER_PATH,
      fnName: 'check',
      fnArgs: [],
    })

    return pipe(
      forEachAsync(([filePath]: TWorkerResult<string>) => console.log(filePath)),
      toMapAsync
    )(totalResultsIterable)
  },
})

