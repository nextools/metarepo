import plugin from '@start/plugin'
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
import { TPackageJson } from 'fixdeps'
import xRaySnapshots from './plugins/snapshots'
import xRayChromeScreenshots from './plugins/chrome-screenshots'
import xRayFirefoxScreenshots from './plugins/firefox-screenshots'
import xRayChromePerfSnapshots from './plugins/chrome-perf-snapshots'
import xRayIosScreenshots from './plugins/ios-screenshots'
import xRayAndroidScreenshots from './plugins/android-screenshots'
import xRayIosWebScreenshots from './plugins/ios-web-screenshots'
import xRayAndroidWebScreenshots from './plugins/android-web-screenshots'
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

export const CheckChromePerfSnapshots = (fontsDir?: string) => (component = '**') => {
  return sequence(
    find(`packages/${component}/x-ray/perf-snapshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRayChromePerfSnapshots(fontsDir)
  )
}

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

export const CheckIosWebScreenshots = (fontsDir?: string) => (component = '**') => {
  return sequence(
    find(`packages/${component}/x-ray/screenshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRayIosWebScreenshots(fontsDir)
  )
}

export const CheckAndroidWebScreenshots = (fontsDir?: string) => (component = '**') => {
  return sequence(
    find(`packages/${component}/x-ray/screenshots.tsx`),
    env({ NODE_ENV: 'production' }),
    xRayAndroidWebScreenshots(fontsDir)
  )
}

export const checkDeps = () => plugin('checkDeps', ({ logMessage }) => async () => {
  const path = await import('path')
  const { objectHas } = await import('tsfn')
  const { hasDepsToModify } = await import('fixdeps')
  const { getPackage, getPackageDirs } = await import('@auto/fs')
  const packageDirs = await getPackageDirs()

  const fixPackageDir = async (dir: string): Promise<boolean> => {
    const json: TPackageJson = await getPackage(dir)
    let ignoredPackages: string[] = ['@babel/runtime']
    let dependenciesGlobs = ['src/**/*.{ts,tsx,js}']
    let devDependenciesGlobs = ['{test,x-ray}/**/*.{ts,tsx,js}', 'meta.{ts,tsx}']

    if (objectHas(json, 'fixdeps')) {
      const options = json.fixdeps

      if (objectHas(options, 'ignoredPackages')) {
        ignoredPackages = options.ignoredPackages
      }

      if (objectHas(options, 'dependenciesGlobs')) {
        dependenciesGlobs = options.dependenciesGlobs
      }

      if (objectHas(options, 'devDependenciesGlobs')) {
        devDependenciesGlobs = options.devDependenciesGlobs
      }
    }

    return hasDepsToModify({
      ignoredPackages,
      packagePath: dir,
      dependenciesGlobs,
      devDependenciesGlobs,
    })
  }

  for (const dir of Object.values(packageDirs)) {
    if (await fixPackageDir(dir)) {
      logMessage(`"${path.basename(dir)}" has unfixed dependencies`)
      throw null
    }
  }
})

export const lint = async () => {
  const path = await import('path')
  const packageJson = await import(path.resolve('package.json'))
  const globs = packageJson.workspaces.reduce((acc: string[], glob: string) => (
    acc.concat(
      `${glob}/{src,test,x-ray}/**/*.{ts,tsx}`,
      `${glob}/*.{ts,tsx}`
    )
  ), [] as string[])

  return sequence(
    find([
      ...globs,
      'tasks/**/*.ts',
    ]),
    read,
    eslint({
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint',
    }),
    typescriptCheck(),
    checkDeps()
  )
}

export const test = (packageDir: string = '**') =>
  sequence(
    env({ NODE_ENV: 'test' }),
    find(`coverage/`),
    remove,
    find(`packages/${packageDir}/src/**/*.{ts,tsx}`),
    istanbulInstrument(['.ts', '.tsx']),
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
