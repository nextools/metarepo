import { workerama } from 'workerama'
import { forEachAsync, toMapAsync } from 'iterama'
import { pipe } from 'funcom'
import { TTotalResults } from '../types'
import { TWorkerResult } from './types'
import { MAX_THREAD_COUNT, WORKER_PATH } from './constants'

export const getResults = (files: string[]): Promise<TTotalResults<string>> => {
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
}
