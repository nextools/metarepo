import plugin, { StartFilesProps } from '@start/plugin'

export default (fontsDir?: string) => plugin<StartFilesProps, void>('x-ray', ({ logMessage }) => async ({ files }) => {
  if (files.length === 0) {
    return logMessage('no files, skipping')
  }

  const path = await import('path')
  const { rsolve } = await import('rsolve')
  const { run: runAndroid } = await import('@rebox/android')
  const { run: runWeb } = await import('@rebox/web')
  const { runScreenshotsServer, prepareFiles } = await import('@x-ray/native-screenshots')
  const { runServer: runUiServer } = await import('@x-ray/screenshot-utils')

  const entryPointPath = await rsolve('@x-ray/native-screenshots-app', 'react-native')

  await prepareFiles(entryPointPath, files.map((file) => file.path))

  const runScreenshots = await runScreenshotsServer({ platform: 'android', dpr: 3 })

  let killAll = null

  try {
    killAll = await runAndroid({
      appName: 'X-Ray',
      appId: 'org.bubble_dev.xray',
      entryPointPath,
      fontsDir,
      dependencyNames: [
        'react-native-svg',
        'react-native-view-shot',
      ],
      portsToForward: [3002],
      isHeadless: true,
      logMessage,
    })

    const { result, resultData, hasBeenChanged } = await runScreenshots()

    killAll()

    if (hasBeenChanged) {
      const entryPointPath = await rsolve('@x-ray/ui', 'browser')
      const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

      const closeReboxServer = await runWeb({
        entryPointPath,
        htmlTemplatePath,
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
    if (killAll !== null) {
      killAll()
    }
  }
})
