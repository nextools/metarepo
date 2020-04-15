import { runChromium } from 'xrom'
import { workerama } from 'workerama'
import { toMapAsync, forEachAsync } from 'iterama'
import { pipe } from 'funcom'
import { TTotalResults } from '../types'
import { TCheckOptions, TWorkerResult } from './types'
import { MAX_THREAD_COUNT, WORKER_PATH } from './constants'

export const getResults = async (files: string[]): Promise<TTotalResults> => {
  const browserWSEndpoint = await runChromium({ shouldCloseOnExit: true })
  const checkOptions: TCheckOptions = {
    browserWSEndpoint,
    dpr: 2,
  }

  const totalResultsIterable = workerama<TWorkerResult<Uint8Array>>({
    items: files,
    maxThreadCount: MAX_THREAD_COUNT,
    fnFilePath: WORKER_PATH,
    fnName: 'check',
    fnArgs: [checkOptions],
  })

  return pipe(
    forEachAsync(([filePath]: TWorkerResult<Uint8Array>) => console.log(filePath)),
    toMapAsync
  )(totalResultsIterable)
}
