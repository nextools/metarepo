import {
  CheckChromiumScreenshots,
  CheckIosScreenshots,
  CheckAndroidScreenshots,
  CheckReactSnapshots,
  CheckReactNativeSnapshots,
  Pkg,
  RunApp,
} from '@nextools/start-preset'
import plugin from '@start/plugin'
import { Sandbox } from './sandbox'

const shouldBailout = Boolean(process.env.CI)

export * from '@nextools/start-preset'

export const checkChromiumScreenshots = CheckChromiumScreenshots({ shouldBailout, chromiumVersion: '83' })
export const checkIosScreenshots = CheckIosScreenshots({ shouldBailout })
export const checkAndroidScreenshots = CheckAndroidScreenshots({ shouldBailout })
export const checkReactSnapshots = CheckReactSnapshots({ shouldBailout })
export const checkReactNativeSnapshots = CheckReactNativeSnapshots({ shouldBailout })

// custom tasks:
export const pkg = Pkg({
  lib: {
    $description$: null,
    $exportedName$: null,
    $year$: String(new Date().getFullYear()),
  },
  app: {
    $year$: String(new Date().getFullYear()),
  },
})

export const graphiq = RunApp({
  name: 'Graphiq',
  entryPointPath: 'tasks/graphiq/index.tsx',
  htmlTemplatePath: 'packages/graphiq/templates/dev.html',
})

export const rebox = (platform: 'ios'| 'android') =>
  plugin(platform, () => async () => {
    const path = await import('path')

    const entryPointPath = path.resolve('./tasks/rebox/App.tsx')
    const fontsDir = path.resolve('./tasks/rebox/fonts/')

    if (platform === 'ios') {
      const { runIosApp } = await import('@rebox/ios')

      await runIosApp({
        appName: 'ReboxTest',
        appId: 'org.rebox.test',
        iPhoneModel: '8',
        iOSVersion: '13',
        entryPointPath,
        fontsDir,
        dependencyNames: ['react-native-svg'],
      })
    }

    if (platform === 'android') {
      const { runAndroidApp } = await import('@rebox/android')

      await runAndroidApp({
        appName: 'ReboxTest',
        appId: 'org.rebox.test',
        entryPointPath,
        fontsDir,
        dependencyNames: ['react-native-svg'],
      })
    }
  })

export const sandbox = Sandbox({
  entryPointPath: 'tasks/sandbox/App.tsx',
  htmlTemplatePath: 'tasks/sandbox/templates/dev.html',
})

export const run = (file: string) =>
  plugin('main', () => async () => {
    const { resolve } = await import('path')
    const { main } = await import(resolve(file))

    await main()
  })

export const revert = () =>
  plugin('web', () => async () => {
    const { runWebApp } = await import('@rebox/web')

    await runWebApp({
      entryPointPath: './tasks/revert/index.tsx',
      htmlTemplatePath: './tasks/revert/templates/dev.html',
    })
  })

export const upgrade = (depName: string) =>
  plugin('dependency', () => async () => {
    const { upgradeDependency } = await import('yupg')

    await upgradeDependency(depName)
  })
