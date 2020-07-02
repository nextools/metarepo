import { TPlugin } from '@x-ray/core'
import { pipe } from 'funcom'
import { forEachAsync, toMapAsync } from 'iterama'
import { workerama } from 'workerama'
import { MAX_THREAD_COUNT, WORKER_PATH } from './constants'
import { TWorkerResult } from './types'

export type TReactSnapshotsOptions = {
  shouldBailout?: boolean,
}

export const reactSnapshots = (options?: TReactSnapshotsOptions): TPlugin<string> => ({
  name: 'react-snapshots',
  encoding: 'text',
  appEntryPointPath: require.resolve('./App'),
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
      forEachAsync((entry: TWorkerResult<string>) => console.log(entry[1].name)),
      toMapAsync
    )(totalResultsIterable)
  },
})

