import path from 'path'
import prettyMs from 'pretty-ms'
import { run as runRebox } from '@rebox/web'
import { broResolve } from 'bro-resolve'
import { runServer } from './server/run'
import { UI_HOST, UI_PORT } from './constants'
import { getResults } from './chrome/get-results'

const checkChromeScreenshots = async (files: string[]): Promise<void> => {
  const startTime = Date.now()

  const { status, results } = await getResults(files)

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
    require.resolve('./examples/button.tsx'),
    require.resolve('./examples/input.tsx'),
    // require.resolve('./screenshots/title.tsx'),
    // require.resolve('./screenshots/paragraph.tsx'),
    // require.resolve('./screenshots/select.tsx'),
  ])
}
