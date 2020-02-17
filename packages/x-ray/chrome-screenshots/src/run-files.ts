import path from 'path'
import { cpus } from 'os'
import fetch from 'node-fetch'
import { run } from '@rebox/web'
import { runServer, runScreenshots } from '@x-ray/screenshot-utils'
import { broResolve } from 'bro-resolve'
import { TOptions, TUserOptions } from './types'

const CONCURRENCY = Math.max(cpus().length - 1, 1)
const DEBUGGER_ENDPOINT_HOST = 'localhost'
const DEBUGGER_ENDPOINT_PORT = 9222
const defaultOptions = {
  dpr: 2,
  width: 1024,
  height: 1024,
}
const childFile = require.resolve('./child')

export const runFiles = async (targetFiles: string[], userOptions: TUserOptions) => {
  const response = await fetch(`http://${DEBUGGER_ENDPOINT_HOST}:${DEBUGGER_ENDPOINT_PORT}/json/version`)
  const { webSocketDebuggerUrl } = await response.json() as { webSocketDebuggerUrl: string }
  const options: TOptions = {
    ...defaultOptions,
    ...userOptions,
    webSocketDebuggerUrl,
  }

  const { result, resultData, hasBeenChanged } = await runScreenshots(childFile, targetFiles, CONCURRENCY, options)

  if (hasBeenChanged) {
    const entryPointPath = await broResolve('@x-ray/ui')
    const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

    const closeReboxServer = await run({
      htmlTemplatePath,
      entryPointPath,
      isQuiet: true,
    })

    console.log('open http://localhost:3000/ to approve or discard changes')

    await runServer({
      platform: options.platform,
      result,
      resultData,
    })
    await closeReboxServer()
  }
}
