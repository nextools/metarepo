import path from 'path'
import plugin from '@start/plugin'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import env from '@start/plugin-env'
import xRayChromeScreenshots from './plugins/chrome-screenshots-plugin'
import xRayFirefoxScreenshots from './plugins/firefox-screenshots-plugin'
import xRayIosScreenshots from './plugins/ios-screenshots-plugin'
import xRayAndroidScreenshots from './plugins/android-screenshots-plugin'
import xRaySnapshots from './plugins/snapshots-plugin'
import withChromium from './plugins/with-chromium'
import waitForChromium from './plugins/wait-for-chromium'
import waitForFirefox from './plugins/wait-for-firefox'
import withFirefox from './plugins/with-firefox'

export const checkWebSnapshots = (component = '**') =>
  sequence(
    find(`packages/${component}/test/snapshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRaySnapshots({
      platform: 'web',
      extensions: [
        '.web.js',
        '.web.ts',
        '.web.tsx',
        '.js',
        '.ts',
        '.tsx',
      ],
    })
  )

export const checkNativeSnapshots = (component = '**') =>
  sequence(
    find(`packages/${component}/test/snapshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRaySnapshots({
      platform: 'native',
      mocks: {
        'react-native': path.resolve('tasks/x-ray/mocks/react-native.js'),
        'react-native-svg': path.resolve('tasks/x-ray/mocks/react-native-svg.js'),
      },
      extensions: [
        '.native.js',
        '.native.ts',
        '.native.tsx',
        '.ios.js',
        '.ios.ts',
        '.ios.tsx',
        '.js',
        '.ts',
        '.tsx',
      ],
    })
  )

export const checkChromeScreenshots = (component = '**') =>
  withChromium(
    sequence(
      find(`packages/${component}/test/screenshots.tsx`),
      waitForChromium,
      env({ NODE_ENV: 'production' }),
      xRayChromeScreenshots({
        platform: 'chrome',
        extensions: [
          '.web.js',
          '.web.ts',
          '.web.tsx',
          '.js',
          '.ts',
          '.tsx',
        ],
      })
    )
  )

export const checkFirefoxScreenshots = (component = '**') =>
  withFirefox(
    sequence(
      find(`packages/${component}/test/screenshots.tsx`),
      waitForFirefox,
      env({ NODE_ENV: 'production' }),
      xRayFirefoxScreenshots({
        platform: 'firefox',
        extensions: [
          '.web.js',
          '.web.ts',
          '.web.tsx',
          '.js',
          '.ts',
          '.tsx',
        ],
      })
    )
  )

export const checkIosScreenshots = (component = '**') =>
  sequence(
    find(`packages/${component}/test/screenshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRayIosScreenshots('packages/x-ray/native-screenshots-app/build/X-Ray.app')
  )

export const checkAndroidScreenshots = (component = '**') =>
  sequence(
    find(`packages/${component}/test/screenshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRayAndroidScreenshots('packages/x-ray/native-screenshots-app/build/X-Ray.apk')
  )

export const buildXRayIos = (packageDir = 'packages/x-ray/native-screenshots-app/') =>
  plugin('build', ({ logMessage }) => async () => {
    const { copyTemplate, buildDebug } = await import('@rebox/ios')
    const { linkDependencyIos } = await import('rn-link')

    const projectPath = await copyTemplate('X-Ray')

    logMessage(`rebox copy: ${projectPath}`)

    linkDependencyIos({
      projectPath,
      dependencyPath: 'node_modules/react-native-view-shot/ios',
    })

    logMessage('dependencies are linked')

    await buildDebug({
      projectPath,
      outputPath: path.join(packageDir, 'build'),
      osVersion: '12.2',
      platformName: 'iOS Simulator',
      appName: 'X-Ray',
      appId: 'org.bubble-dev.xray',
    })
  })

export const buildXRayAndroid = (packageDir = 'packages/x-ray/native-screenshots-app/') =>
  plugin('build', ({ logMessage }) => async () => {
    const { buildDebug, copyTemplate } = await import('@rebox/android')
    const { linkDependencyAndroid } = await import('rn-link')

    const projectPath = await copyTemplate('X-Ray')

    logMessage(`rebox copy: ${projectPath}`)

    linkDependencyAndroid({
      projectPath,
      dependencyName: 'react-native-view-shot',
      dependencyPath: 'node_modules/react-native-view-shot',
    })

    logMessage('dependencies are linked')

    await buildDebug({
      projectPath,
      outputPath: path.join(packageDir, 'build'),
      appName: 'X-Ray',
      appId: 'org.bubble_dev.xray',
    })
  })
