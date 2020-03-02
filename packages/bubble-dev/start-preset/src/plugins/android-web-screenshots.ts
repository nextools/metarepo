import plugin, { StartFilesProps } from '@start/plugin'

export default (fontsDir?: string) => plugin<StartFilesProps, void>('x-ray', ({ logMessage }) => async ({ files }) => {
  const path = await import('path')
  const { rsolve } = await import('rsolve')
  const { run: runAndroid } = await import('@rebox/android')
  const { run: runWeb } = await import('@rebox/web')
  const { runScreenshotsServer } = await import('@x-ray/web-mobile-screenshots')
  const { runServer: runUiServer } = await import('@x-ray/screenshot-utils')

  const targetFiles = files.map((file) => file.path)
  const runScreenshots = await runScreenshotsServer(targetFiles, {
    platform: 'android-web',
    dpr: 3,
    extensions: [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.ts',
      '.tsx',
    ],
    entryPointField: 'main',
    fontsDir,
  })

  let killAndroid = null

  try {
    const entryPointPath = await rsolve('@x-ray/web-mobile-screenshots-app', 'react-native')

    killAndroid = await runAndroid({
      appName: 'X-Ray-Mobile',
      appId: 'org.bubble_dev.xray_mobile',
      entryPointPath,
      dependencyNames: [
        'react-native-svg',
        'react-native-view-shot',
        'react-native-webview',
      ],
      fontsDir,
      portsToForward: [3002],
      isHeadless: true,
      logMessage,
    })

    const { result, resultData, hasBeenChanged } = await runScreenshots()

    killAndroid()

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
        platform: 'android-web',
        result,
        resultData,
      })
      await closeReboxServer()
    }
  } finally {
    if (killAndroid !== null) {
      killAndroid()
    }
  }
})
