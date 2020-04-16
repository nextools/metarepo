import path from 'path'
import prettyMs from 'pretty-ms'
import { runWebApp } from '@rebox/web'
import { rsolve } from 'rsolve'
import { runServer } from './server/run'
import { UI_HOST, UI_PORT } from './constants'
import { getResults } from './ios-screenshots/get-results'

const checkIosScreenshots = async (files: string[]): Promise<void> => {
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

  const savePromise = await runServer({
    results: totalResults,
    type: 'ios-screenshots',
    encoding: 'image',
  })
  const entryPointPath = await rsolve('@x-ray/ui', 'browser')
  const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')
  const closeRebox = await runWebApp({
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
  await checkIosScreenshots([
    require.resolve('./examples/text.tsx'),
    require.resolve('./examples/text2.tsx'),
  ])
}
