import path from 'path'
import { runChromium } from 'xrom'
import { workerama } from 'workerama'
import prettyMs from 'pretty-ms'
import { run as runRebox } from '@rebox/web'
import { broResolve } from 'bro-resolve'
import { TWorkerResult, TResults, TCheckOptions } from './types'
import { runServer } from './server/run'
import { MAX_THREAD_COUNT, WORKER_PATH, UI_HOST, UI_PORT } from './constants'
import { } from './worker'

// export type TCheckChomeScreenshotsOptions = {
//   dpr?: number,
//   width?: number,
//   height?: number,
// }

const checkChromeScreenshots = async (files: string[]): Promise<void> => {
  const browserWSEndpoint = await runChromium({ shouldCloseOnExit: true })
  const status = {
    ok: 0,
    new: 0,
    diff: 0,
    deleted: 0,
  }
  const results = {} as TResults
  const startTime = Date.now()
  const checkOptions: TCheckOptions = {
    browserWSEndpoint,
    dpr: 2,
  }

  await workerama({
    items: files,
    itemsPerThreadCount: 1,
    maxThreadCount: MAX_THREAD_COUNT,
    fnFilePath: WORKER_PATH,
    fnName: 'check',
    fnArgs: [checkOptions],
    onItemResult: (value: TWorkerResult<Uint8Array>) => {
      results[value.filePath] = value.results

      status.ok += value.status.ok
      status.new += value.status.new
      status.diff += value.status.diff
      status.deleted += value.status.deleted
    },
  })

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
    // require.resolve('./screenshots/input.tsx'),
    // require.resolve('./screenshots/title.tsx'),
    // require.resolve('./screenshots/paragraph.tsx'),
    // require.resolve('./screenshots/select.tsx'),
  ])
}
