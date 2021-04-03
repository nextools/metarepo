import plugin from '@start/plugin'
import concurrent from '@start/plugin-concurrent'
import env from '@start/plugin-env'
import find from '@start/plugin-find'
import remove from '@start/plugin-remove'
import sequence from '@start/plugin-sequence'

const sanitizePackageName = (name: string): string => {
  return name.replace(/[@/-]/, '').toLowerCase()
}

export type TRunAppOptions = {
  name: string,
  entryPointPath: string,
  htmlTemplatePath: string,
  assetsPath?: string,
  fontsDir?: string,
}

export const RunApp = (options: TRunAppOptions) => (...args: string[]) => {
  const platforms = args.length > 0 ? args : ['web', 'ios', 'android']

  return sequence(
    env({ NODE_ENV: 'development' }),
    platforms.includes('web') && plugin('web', ({ logMessage }) => async () => {
      const { runWebApp } = await import('@rebox/web')

      await runWebApp({
        entryPointPath: options.entryPointPath,
        htmlTemplatePath: options.htmlTemplatePath,
        assetsPath: options.assetsPath,
        isQuiet: true,
      })

      logMessage('http://localhost:3000/')
    }),
    concurrent(
      platforms.includes('ios') && plugin('ios', () => async () => {
        const { runIosApp } = await import('@rebox/ios')

        await runIosApp({
          entryPointPath: options.entryPointPath,
          appId: `org.nextools.${sanitizePackageName(options.name)}`,
          appName: options.name,
          iPhoneModel: '12',
          iOSVersion: '14',
          fontsDir: options.fontsDir,
          dependencyNames: ['react-native-svg'],
        })
      }),
      platforms.includes('android') && plugin('android', () => async () => {
        const { runAndroidApp } = await import('@rebox/android')

        await runAndroidApp({
          entryPointPath: options.entryPointPath,
          appId: `org.nextools.${sanitizePackageName(options.name)}`,
          appName: options.name,
          fontsDir: options.fontsDir,
          dependencyNames: ['react-native-svg'],
        })
      })
    )
  )
}

export type TBuildAppOptions = {
  entryPointPath: string,
  htmlTemplatePath: string,
  outputPath: string,
}

export const BuildApp = (options: TBuildAppOptions) => () =>
  sequence(
    find(options.outputPath),
    remove,
    plugin('web', () => async () => {
      const { browsersList } = await import('@nextools/browsers-list')
      const { buildWebAppRelease } = await import('@rebox/web')

      await buildWebAppRelease({
        entryPointPath: options.entryPointPath,
        htmlTemplatePath: options.htmlTemplatePath,
        outputPath: options.outputPath,
        browsersList,
      })
    })
  )
