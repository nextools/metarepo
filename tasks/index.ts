import {
  CheckChromeScreenshots,
  CheckFirefoxScreenshots,
  CheckAndroidScreenshots,
  CheckIosScreenshots,
  Sandbox,
} from '@bubble-dev/start-preset'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import plugin from '@start/plugin'

export * from '@bubble-dev/start-preset'

// custom tasks:
export const checkChromeScreenshots = CheckChromeScreenshots()
export const checkFirefoxScreenshots = CheckFirefoxScreenshots()
export const checkAndroidScreenshots = CheckAndroidScreenshots()
export const checkIosScreenshots = CheckIosScreenshots()

export const sandbox = Sandbox({
  entryPointPath: './tasks/sandbox/index.tsx',
  htmlTemplatePath: './tasks/sandbox/templates/dev.html',
})

export const webIos = (component = '**') =>
  sequence(
    find(`packages/${component}/x-ray/screenshots.tsx`),
    plugin('test', ({ logMessage }) => async ({ files }) => {
      const path = await import('path')
      const { rnResolve } = await import('rn-resolve')
      const { broResolve } = await import('bro-resolve')
      const { run: runIos } = await import('@rebox/ios')
      const { run: runWeb } = await import('@rebox/web')
      const { runScreenshotsServer } = await import('@x-ray/web-mobile-screenshots')
      const { runServer: runUiServer } = await import('@x-ray/screenshot-utils')

      const targetFiles = files.map((file) => file.path)
      const runScreenshots = await runScreenshotsServer(targetFiles, {
        platform: 'ios-web',
        dpr: 2,
        extensions: [
          '.web.js',
          '.web.ts',
          '.web.tsx',
          '.js',
          '.ts',
          '.tsx',
        ],
        entryPointField: 'browser',
      })

      let killIos = null

      try {
        const entryPointPath = await rnResolve('@x-ray/web-mobile-screenshots-app')
        killIos = await runIos({
          appName: 'X-Ray-Mobile',
          appId: 'org.bubble-dev.x-ray-mobile',
          iOSVersion: '12.2',
          entryPointPath,
          dependencyNames: [
            'react-native-svg',
            'react-native-view-shot',
            'react-native-webview',
          ],
          isHeadless: false,
          logMessage,
        })

        const { result, resultData, hasBeenChanged } = await runScreenshots()

        killIos()

        if (hasBeenChanged) {
          const entryPointPath = await broResolve('@x-ray/ui')
          const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

          const closeReboxServer = await runWeb({
            entryPointPath,
            htmlTemplatePath,
          })

          console.log('open http://localhost:3000/ to approve or discard changes')

          await runUiServer({
            platform: 'ios-web',
            result,
            resultData,
          })
          await closeReboxServer()
        }
      } finally {
        if (killIos !== null) {
          killIos()
        }
      }
    })
  )

export const webAndroid = (component = '**') =>
  sequence(
    find(`packages/${component}/x-ray/screenshots.tsx`),
    plugin('test', ({ logMessage }) => async ({ files }) => {
      const path = await import('path')
      const { rnResolve } = await import('rn-resolve')
      const { broResolve } = await import('bro-resolve')
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
        entryPointField: 'browser',
      })

      let killAndroid = null

      try {
        const entryPointPath = await rnResolve('@x-ray/web-mobile-screenshots-app')
        killAndroid = await runAndroid({
          appName: 'X-Ray-Mobile',
          appId: 'org.bubble_dev.xray_mobile',
          entryPointPath,
          dependencyNames: [
            'react-native-svg',
            'react-native-view-shot',
            'react-native-webview',
          ],
          portsToForward: [3002],
          isHeadless: false,
          logMessage,
        })

        const { result, resultData, hasBeenChanged } = await runScreenshots()

        killAndroid()

        if (hasBeenChanged) {
          const entryPointPath = await broResolve('@x-ray/ui')
          const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

          const closeReboxServer = await runWeb({
            entryPointPath,
            htmlTemplatePath,
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
  )
