import plugin, { StartFilesProps } from '@start/plugin'

export default (fontsDir?: string) => plugin<StartFilesProps, void>('x-ray', ({ logMessage }) => async ({ files }) => {
  if (files.length === 0) {
    return logMessage('no files, skipping')
  }

  const path = await import('path')
  const { rnResolve } = await import('rn-resolve')
  const { broResolve } = await import('bro-resolve')
  const { run: runIos } = await import('@rebox/ios')
  const { run: runWeb } = await import('@rebox/web')
  const { runScreenshotsServer, prepareFiles } = await import('@x-ray/native-screenshots')
  const { runServer: runUiServer } = await import('@x-ray/screenshot-utils')

  const entryPointPath = await rnResolve('@x-ray/native-screenshots-app')

  await prepareFiles(entryPointPath, files.map((file) => file.path))

  const runScreenshots = await runScreenshotsServer({ platform: 'ios', dpr: 2 })

  let killAll = null

  try {
    killAll = await runIos({
      appName: 'X-Ray',
      appId: 'org.bubble-dev.x-ray',
      iOSVersion: '12.2',
      entryPointPath,
      fontsDir,
      dependencyNames: [
        'react-native-svg',
        'react-native-view-shot',
      ],
      isHeadless: true,
      logMessage,
    })

    const { result, resultData, hasBeenChanged } = await runScreenshots()

    killAll()

    if (hasBeenChanged) {
      const entryPointPath = await broResolve('@x-ray/ui')
      const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

      const closeReboxServer = await runWeb({
        entryPointPath,
        htmlTemplatePath,
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
    if (killAll !== null) {
      killAll()
    }
  }
})
