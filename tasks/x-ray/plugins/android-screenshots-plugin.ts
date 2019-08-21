import plugin, { StartFilesProps } from '@start/plugin'

export default (appPath: string) =>
  plugin<StartFilesProps, void>('x-ray-android-screenshots', ({ logMessage }) => async ({ files }) => {
    if (files.length === 0) {
      return logMessage('no files, skipping')
    }

    const { rnResolve } = await import('rn-resolve')
    const { runEmulator, serveJsBundle, installApp, launchApp } = await import('@rebox/android')
    const { run: runWeb } = await import('@rebox/web')
    const { runScreenshotsServer, prepareFiles } = await import('@x-ray/native-screenshots')
    const { runServer: runUiServer } = await import('@x-ray/screenshot-utils')

    const entryPointPath = await rnResolve('@x-ray/native-screenshots-app')

    await prepareFiles(entryPointPath, files.map((file) => file.path))

    let killServer = null
    let killEmulator = null

    try {
      killServer = await serveJsBundle({
        entryPointPath,
        isDev: false,
      })

      logMessage('server is ready')

      killEmulator = await runEmulator({
        isHeadless: true,
        portsToForward: [3002, 8081],
      })

      logMessage('device is ready')

      const runScreenshots = await runScreenshotsServer({ platform: 'android', dpr: 3 })

      await installApp({ appPath })

      logMessage('app is installed')

      await launchApp({ appId: 'org.bubble_dev.xray' })

      logMessage('app is launched')

      const { result, resultData, hasBeenChanged } = await runScreenshots()

      if (hasBeenChanged) {
        const closeReboxServer = await runWeb({
          htmlTemplatePath: 'packages/x-ray/ui/src/index.html',
          entryPointPath: 'packages/x-ray/ui/src/index.tsx',
          isQuiet: true,
        })

        console.log('open http://localhost:3000/ to approve or discard changes')

        await runUiServer({
          platform: 'android',
          result,
          resultData,
        })
        await closeReboxServer()
      }
    } finally {
      if (killEmulator !== null) {
        killEmulator()
      }

      if (killServer !== null) {
        killServer()
      }
    }
  })
