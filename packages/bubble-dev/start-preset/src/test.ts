import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import remove from '@start/plugin-remove'
import read from '@start/plugin-read'
import env from '@start/plugin-env'
import eslint from '@start/plugin-lib-eslint'
import typescriptCheck from '@start/plugin-lib-typescript-check'
import codecov from '@start/plugin-lib-codecov'
import tape from '@start/plugin-lib-tape'
import { istanbulInstrument, istanbulReport } from '@start/plugin-lib-istanbul'
// @ts-ignore
import tapDiff from 'tap-diff'
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
    find(`packages/${component}/x-ray/snapshots.tsx`),
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
      entryPointField: 'main',
    })
  )

export const checkNativeSnapshots = (component = '**') =>
  sequence(
    find(`packages/${component}/x-ray/snapshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRaySnapshots({
      platform: 'native',
      mocks: {
        'react-native': require.resolve('./mocks/react-native.js'),
        'react-native-svg': require.resolve('./mocks/react-native-svg.js'),
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
      entryPointField: 'react-native',
    })
  )

export const CheckChromeScreenshots = (fontsDir?: string) => (component = '**') =>
  withChromium(
    sequence(
      find(`packages/${component}/x-ray/screenshots.tsx`),
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
        entryPointField: 'main',
      })
    ),
    fontsDir
  )

export const CheckFirefoxScreenshots = (fontsDir?: string) => (component = '**') =>
  withFirefox(
    sequence(
      find(`packages/${component}/x-ray/screenshots.tsx`),
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
        entryPointField: 'main',
      })
    ),
    fontsDir
  )

export const CheckIosScreenshots = (fontsDir?: string) => (component = '**') => {
  return sequence(
    find(`packages/${component}/x-ray/screenshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRayIosScreenshots(fontsDir)
  )
}

export const CheckAndroidScreenshots = (fontsDir?: string) => (component = '**') => {
  return sequence(
    find(`packages/${component}/x-ray/screenshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRayAndroidScreenshots(fontsDir)
  )
}

export const lint = () =>
  sequence(
    find([
      'packages/*/{src,test,x-ray}/**/*.{ts,tsx}',
      'packages/*/*/{src,test,x-ray}/**/*.{ts,tsx}',
      'tasks/**/*.ts',
    ]),
    read,
    eslint({
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint',
    }),
    typescriptCheck()
  )

export const test = (packageDir: string = '**') =>
  sequence(
    env({ NODE_ENV: 'test' }),
    find(`coverage/`),
    remove,
    find(`packages/${packageDir}/src/**/*.{ts,tsx}`),
    istanbulInstrument({ esModules: true }, ['.ts', '.tsx']),
    find([
      `packages/${packageDir}/test/**/*.{ts,tsx}`,
      `!packages/${packageDir}/test/fixtures`,
    ]),
    tape(tapDiff),
    istanbulReport(['lcovonly', 'html', 'text-summary'])
  )

export const ci = () =>
  sequence(
    lint(),
    test(),
    find('coverage/lcov.info'),
    read,
    codecov
  )
