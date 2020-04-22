import { workerama } from 'workerama'
import { forEachAsync, toMapAsync } from 'iterama'
import { pipe } from 'funcom'
import { TPlugin } from '@x-ray/core'
import { TWorkerResult } from './types'
import { MAX_THREAD_COUNT, WORKER_PATH } from './constants'

export type TReactSnapshotsOptions = {
  shouldBailout?: boolean,
}

export const reactSnapshots = (options?: TReactSnapshotsOptions): TPlugin<string> => ({
  name: 'react-snapshots',
  encoding: 'text',
  getResults: (files) => {
    const opts = {
      shouldBailout: false,
      ...options,
    }
    const totalResultsIterable = workerama<TWorkerResult<string>>({
      items: files,
      maxThreadCount: MAX_THREAD_COUNT,
      fnFilePath: WORKER_PATH,
      fnName: 'check',
      fnArgs: [opts],
    })

    return pipe(
      forEachAsync(([filePath]: TWorkerResult<string>) => console.log(filePath)),
      toMapAsync
    )(totalResultsIterable)
  },
})

