import { runChromium } from 'xrom'
import { workerama } from 'workerama'
import { TResults, TWorkerResult } from '../types'
import { TCheckOptions } from './types'
import { MAX_THREAD_COUNT, WORKER_PATH } from './constants'

export const getResults = async (files: string[]) => {
  const browserWSEndpoint = await runChromium({ shouldCloseOnExit: true })
  const results: TResults = new Map()
  const status = {
    ok: 0,
    new: 0,
    diff: 0,
    deleted: 0,
  }
  const checkOptions: TCheckOptions = {
    browserWSEndpoint,
    dpr: 2,
  }

  const resultsIterable = workerama<TWorkerResult<Uint8Array>>({
    items: files,
    maxThreadCount: MAX_THREAD_COUNT,
    fnFilePath: WORKER_PATH,
    fnName: 'check',
    fnArgs: [checkOptions],
  })

  for await (const result of resultsIterable) {
    console.log(result.filePath)

    results.set(result.filePath, result.results)

    status.ok += result.status.ok
    status.new += result.status.new
    status.diff += result.status.diff
    status.deleted += result.status.deleted
  }

  return { status, results }
}
