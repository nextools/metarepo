import { workerama } from 'workerama'
import { forEachAsync, toMapAsync, mapAsync } from 'iterama'
import { pipe } from 'funcom'
import { TWorkerResult } from './types'
import { MAX_THREAD_COUNT, WORKER_PATH } from './constants'

export const getResults = async (files: string[]) => {
  const status = {
    ok: 0,
    new: 0,
    diff: 0,
    deleted: 0,
  }

  const resultsIterable = workerama<TWorkerResult<Uint8Array>>({
    items: files,
    maxThreadCount: MAX_THREAD_COUNT,
    fnFilePath: WORKER_PATH,
    fnName: 'check',
    fnArgs: [],
  })

  const results = await pipe(
    forEachAsync(([key, value]: TWorkerResult<Uint8Array>) => {
      console.log(key)

      status.ok += value.status.ok
      status.new += value.status.new
      status.diff += value.status.diff
      status.deleted += value.status.deleted
    }),
    mapAsync(([key, value]) => [key, value.results] as const),
    toMapAsync
  )(resultsIterable)

  return { status, results }
}
