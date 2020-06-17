import plugin from '@start/plugin'
import {
  CheckChromiumScreenshots,
  CheckIosScreenshots,
  CheckAndroidScreenshots,
  CheckReactSnapshots,
  CheckReactNativeSnapshots,
  Pkg,
} from '@nextools/start-preset'

const shouldBailout = Boolean(process.env.CI)

export * from '@nextools/start-preset'

export const checkChromiumScreenshots = CheckChromiumScreenshots({ shouldBailout, chromiumVersion: '83' })
export const checkIosScreenshots = CheckIosScreenshots({ shouldBailout })
export const checkAndroidScreenshots = CheckAndroidScreenshots({ shouldBailout })
export const checkReactSnapshots = CheckReactSnapshots({ shouldBailout })
export const checkReactNativeSnapshots = CheckReactNativeSnapshots({ shouldBailout })

// custom tasks:
export const pkg = Pkg({
  lib: {
    $description$: null,
    $exportedName$: null,
    $year$: String(new Date().getFullYear()),
  },
})

export const graphiq = () =>
  plugin('demo', ({ logMessage }) => async () => {
    const { runWebApp } = await import('@rebox/web')
    const entryPointPath = './tasks/graphiq/index.tsx'
    const htmlTemplatePath = './tasks/graphiq/index.html'

    await runWebApp({
      entryPointPath,
      htmlTemplatePath,
      isQuiet: true,
    })

    logMessage('http://localhost:3000/')
  })

export const run = (file: string) =>
  plugin('main', () => async () => {
    const { resolve } = await import('path')
    const { main } = await import(resolve(file))

    await main()
  })
