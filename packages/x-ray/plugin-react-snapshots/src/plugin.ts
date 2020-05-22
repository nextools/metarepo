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
  appEntryPointPath: require.resolve('./App.tsx'),
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

