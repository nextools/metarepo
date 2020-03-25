import path from 'path'
import { runChromium } from 'xrom'
import { workerama } from 'workerama'
import prettyMs from 'pretty-ms'
import { run as runRebox } from '@rebox/web'
import { broResolve } from 'bro-resolve'
import { TWorkerResult, TResults, TCheckOptions } from './types'
import { runServer } from './server/run'
import { MAX_THREAD_COUNT, WORKER_PATH, UI_HOST, UI_PORT } from './constants'

const checkChromeScreenshots = async (files: string[]): Promise<void> => {
  const browserWSEndpoint = await runChromium({ shouldCloseOnExit: true })
  const status = {
    ok: 0,
    new: 0,
    diff: 0,
    deleted: 0,
  }
  const results: TResults = new Map()
  const startTime = Date.now()
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

  console.log(`ok: ${status.ok}`)
  console.log(`new: ${status.new}`)
  console.log(`diff: ${status.diff}`)
  console.log(`deleted: ${status.deleted}`)
  console.log(`done in ${prettyMs(Date.now() - startTime)}`)

  if (status.new === 0 && status.diff === 0 && status.deleted === 0) {
    return
  }

  let closeRebox = null as null | (() => Promise<void>)
  const savePromise = await runServer(results)

  const entryPointPath = await broResolve('@x-ray/ui')
  const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

  closeRebox = await runRebox({
    htmlTemplatePath,
    entryPointPath,
    isQuiet: true,
  })

  console.log(`open http://${UI_HOST}:${UI_PORT}/ to approve or discard changes`)

  try {
    await savePromise()
  } finally {
    await closeRebox()
  }
}

export const main = async () => {
  await checkChromeScreenshots([
    require.resolve('./screenshots/button.tsx'),
    require.resolve('./screenshots/input.tsx'),
    require.resolve('./screenshots/title.tsx'),
    require.resolve('./screenshots/paragraph.tsx'),
    require.resolve('./screenshots/select.tsx'),
  ])
}
