import { cpus } from 'os'
import { runChromium } from 'xrom'
import { workerama } from 'workerama'

// export type TCheckChomeScreenshotsOptions = {
//   dpr?: number,
//   width?: number,
//   height?: number,
// }

const MAX_THREAD_COUNT = cpus().length - 1
const WORKER_PATH = require.resolve('./worker-setup')

const checkChromeScreenshots = async (files: string[]): Promise<void> => {
  const browserWSEndpoint = await runChromium({ shouldCloseOnExit: true })

  await workerama({
    items: files,
    itemsPerThreadCount: 2,
    maxThreadCount: MAX_THREAD_COUNT,
    fnFilePath: WORKER_PATH,
    fnName: 'check',
    fnArgs: [{ browserWSEndpoint }],
    onItemResult: (result) => {
      console.log(result)
    },
  })
}

export const main = async () => {
  await checkChromeScreenshots([
    require.resolve('./screenshots.tsx'),
  ])
}
