import plugin from '@start/plugin'
import {
  CheckChromeScreenshots,
  CheckFirefoxScreenshots,
  CheckIosScreenshots,
  CheckAndroidScreenshots,
  CheckIosWebScreenshots,
  CheckAndroidWebScreenshots,
  CheckChromePerfSnapshots,
  Pkg,
} from '@nextools/start-preset'

export * from '@nextools/start-preset'

// custom tasks:
export const checkChromeScreenshots = CheckChromeScreenshots()
export const checkFirefoxScreenshots = CheckFirefoxScreenshots()
export const checkAndroidScreenshots = CheckAndroidScreenshots()
export const checkIosScreenshots = CheckIosScreenshots()
export const checkIosWebScreenshots = CheckIosWebScreenshots()
export const checkAndroidWebScreenshots = CheckAndroidWebScreenshots()
export const checkChromePerfSnapshots = CheckChromePerfSnapshots()

export const pkg = Pkg({
  lib: {
    $description$: null,
    $exportedName$: null,
    $year$: String(new Date().getFullYear()),
  },
})

export const graphiq = () =>
  plugin('demo', ({ logMessage }) => async () => {
    const { run } = await import('@rebox/web')
    const entryPointPath = './tasks/graphiq/index.tsx'
    const htmlTemplatePath = './tasks/graphiq/index.html'

    await run({
      entryPointPath,
      htmlTemplatePath,
      isQuiet: true,
    })

    logMessage('http://localhost:3000/')
  })

export const xray = () =>
  plugin('ui', ({ logMessage }) => async () => {
    const { run } = await import('@rebox/web')
    const { runXRayServer } = await import('./x-ray-ui/run-server')

    await runXRayServer()

    await run({
      entryPointPath: './tasks/x-ray-ui/index.tsx',
      htmlTemplatePath: './tasks/x-ray-ui/template.html',
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

export const revert = () => plugin('revert', () => async () => {
  const { run } = await import('@rebox/web')

  await run({
    entryPointPath: './tasks/revert/index.tsx',
    htmlTemplatePath: './tasks/revert/templates/dev.html',
  })
})
