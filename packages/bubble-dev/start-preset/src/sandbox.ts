import sequence from '@start/plugin-sequence'
import env from '@start/plugin-env'
import plugin from '@start/plugin'
import syncState from './plugins/sync-state'
import concurrent from './plugins/concurrent'

export type TSandbox = {
  entryPointPath: string,
  htmlTemplatePath: string,
  assetsPath?: string,
  fontsDir?: string,
}

export const Sandbox = ({ entryPointPath, htmlTemplatePath, assetsPath, fontsDir }: TSandbox) => (...args: string[]) => {
  const platforms = args.length > 0 ? args : ['web', 'ios', 'android']

  return sequence(
    env({ NODE_ENV: 'development' }),
    syncState,
    platforms.includes('web') && plugin('web', () => async () => {
      const { run } = await import('@rebox/web')

      await run({
        entryPointPath,
        htmlTemplatePath,
        assetsPath,
      })
    }),
    concurrent(
      platforms.includes('ios') && plugin('ios', () => async () => {
        const { run } = await import('@rebox/ios')

        await run({
          entryPointPath,
          appId: 'org.bubble-next.sandbox',
          appName: 'Sandbox',
          iOSVersion: '12.2',
          fontsDir,
          dependencyNames: ['react-native-svg'],
        })
      }),
      platforms.includes('android') && plugin('android', () => async () => {
        const { run } = await import('@rebox/android')

        await run({
          entryPointPath,
          appId: 'org.bubble_next.sandbox',
          appName: 'Sandbox',
          fontsDir,
          dependencyNames: ['react-native-svg'],
          portsToForward: [3001],
        })
      })
    )
  )
}
