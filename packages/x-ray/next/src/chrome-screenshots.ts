import path from 'path'
import prettyMs from 'pretty-ms'
import { runWebApp } from '@rebox/web'
import { rsolve } from 'rsolve'
import { runServer } from './server/run'
import { UI_HOST, UI_PORT } from './constants'
import { getResults } from './chrome-screenshots/get-results'

const checkChromeScreenshots = async (files: string[]): Promise<void> => {
  const startTime = Date.now()
  const status = {
    ok: 0,
    new: 0,
    diff: 0,
    deleted: 0,
  }

  const totalResults = await getResults(files)

  for (const result of totalResults.values()) {
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
  const savePromise = await runServer(totalResults, 'chrome-screenshots')

  const entryPointPath = await rsolve('@x-ray/ui', 'browser')
  const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

  closeRebox = await runWebApp({
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
    require.resolve('./examples/button.tsx'),
    require.resolve('./examples/input.tsx'),
    // require.resolve('./examples/title.tsx'),
    // require.resolve('./examples/paragraph.tsx'),
    // require.resolve('./examples/select.tsx'),
  ])
}
