import path from 'path'
import { runScreenshots, runServer } from '@x-ray/screenshot-utils'
import { runWebApp } from '@rebox/web'
import { rsolve } from 'rsolve'
import { TOptions, TUserOptions } from './types'

const defaultOptions = {
  width: 1024,
  height: 1024,
}
const childFile = require.resolve('./child')

export const runFiles = async (targetFiles: string[], userOptions: TUserOptions) => {
  const options: TOptions = {
    ...defaultOptions,
    ...userOptions,
    dpr: 1,
  }

  const { result, resultData, hasBeenChanged } = await runScreenshots(childFile, targetFiles, 1, options)

  if (hasBeenChanged) {
    const entryPointPath = await rsolve('@x-ray/ui', 'browser')
    const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

    const closeReboxServer = await runWebApp({
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
