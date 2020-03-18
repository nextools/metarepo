import { cpus } from 'os'
import path from 'path'
import { runChromium } from 'xrom'
import { workerama } from 'workerama'
import { TarFs } from '@x-ray/tar-fs'
import { TAnyObject } from 'tsfn'
import { TCheckResult } from './types'

// export type TCheckChomeScreenshotsOptions = {
//   dpr?: number,
//   width?: number,
//   height?: number,
// }

const MAX_THREAD_COUNT = cpus().length - 1
const WORKER_PATH = require.resolve('./worker-setup')

type TResults = {
  [path: string]: {
    [id: string]: {
      data: Buffer,
      meta: TAnyObject,
    },
  },
}

const checkChromeScreenshots = async (files: string[]): Promise<void> => {
  const browserWSEndpoint = await runChromium({ shouldCloseOnExit: true })
  const results = {} as TResults

  await workerama({
    items: files,
    itemsPerThreadCount: 1,
    maxThreadCount: MAX_THREAD_COUNT,
    fnFilePath: WORKER_PATH,
    fnName: 'check',
    fnArgs: [{ browserWSEndpoint }],
    onItemResult: (checkResults: TCheckResult[]) => {
      for (const checkResult of checkResults) {
        if (!Reflect.has(results, checkResult.path)) {
          results[checkResult.path] = {}
        }

        results[checkResult.path] = {
          ...results[checkResult.path],
          [checkResult.id]: {
            data: checkResult.data,
            meta: checkResult.meta,
          },
        }
      }
    },
  })

  for (const [filePath, result] of Object.entries(results)) {
    const tarGzDirPath = path.dirname(filePath)
    const tarGzFilePath = path.join(tarGzDirPath, 'chrome-screenshots.tar.gz')
    const tarFs = await TarFs(tarGzFilePath)

    for (const [id, value] of Object.entries(result)) {
      tarFs.write(id, value)
    }

    await tarFs.save()
  }
}

export const main = async () => {
  await checkChromeScreenshots([
    require.resolve('./screenshots.tsx'),
  ])
}
