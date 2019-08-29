import plugin, { StartFilesProps } from '@start/plugin'

export default (appPath: string) =>
  plugin<StartFilesProps, void>('x-ray-ios-screenshots', ({ logMessage }) => async ({ files }) => {
    if (files.length === 0) {
      return logMessage('no files, skipping')
    }

    const path = await import('path')
    const { rnResolve } = await import('rn-resolve')
    const { broResolve } = await import('bro-resolve')
    const { runSimulator, installApp, launchApp, serveJsBundle } = await import('@rebox/ios')
    const { run: runWeb } = await import('@rebox/web')
    const { runScreenshotsServer, prepareFiles } = await import('@x-ray/native-screenshots')
    const { runServer: runUiServer } = await import('@x-ray/screenshot-utils')

    const entryPointPath = await rnResolve('@x-ray/native-screenshots-app')

    await prepareFiles(entryPointPath, files.map((file) => file.path))

    let killServer = null
    let killSimulator = null

    try {
      killServer = await serveJsBundle({
        entryPointPath,
        isDev: false,
      })

      logMessage('server is ready')

      killSimulator = await runSimulator({
        iOSVersion: '12.2',
        iPhoneVersion: 7,
        isHeadless: true,
      })

      logMessage('device is ready')

      await installApp({ appPath })

      logMessage('app is installed')

      const runScreenshots = await runScreenshotsServer({ platform: 'ios', dpr: 2 })

      await launchApp({ appId: 'org.bubble-dev.xray' })

      logMessage('app is launched')

      const { result, resultData, hasBeenChanged } = await runScreenshots()

      killSimulator()

      if (hasBeenChanged) {
        const entryPointPath = await broResolve('@x-ray/ui')
        const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

        const closeReboxServer = await runWeb({
          entryPointPath,
          htmlTemplatePath,
          isQuiet: true,
        })

        console.log('open http://localhost:3000/ to approve or discard changes')

        await runUiServer({
          platform: 'ios',
          result,
          resultData,
        })
        await closeReboxServer()
      }
    } finally {
      if (killSimulator !== null) {
        killSimulator()
      }

      if (killServer !== null) {
        killServer()
      }
    }
  })
