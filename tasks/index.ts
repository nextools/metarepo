import plugin from '@start/plugin'
import {
  CheckChromeScreenshots,
  CheckFirefoxScreenshots,
  CheckIosScreenshots,
  CheckAndroidScreenshots,
  CheckIosWebScreenshots,
  CheckAndroidWebScreenshots,
  Sandbox,
  CheckChromePerfSnapshots,
} from '@bubble-dev/start-preset'

export * from '@bubble-dev/start-preset'

// custom tasks:
export const checkChromeScreenshots = CheckChromeScreenshots()
export const checkFirefoxScreenshots = CheckFirefoxScreenshots()
export const checkAndroidScreenshots = CheckAndroidScreenshots()
export const checkIosScreenshots = CheckIosScreenshots()
export const checkIosWebScreenshots = CheckIosWebScreenshots()
export const checkAndroidWebScreenshots = CheckAndroidWebScreenshots()
export const checkChromePerfSnapshots = CheckChromePerfSnapshots()

export const sandbox = Sandbox({
  entryPointPath: './tasks/sandbox/index.tsx',
  htmlTemplatePath: './tasks/sandbox/templates/dev.html',
})

export const temp = () => plugin('webpack', () => async () => {
  const { getBuildReleaseStats } = await import('@rebox/web')

  const stats = await getBuildReleaseStats({
    entryPointPath: 'packages/primitives/button/x-ray/bundle-size-snapshots.tsx',
    stats: {
      entrypoints: false,
      modules: false,
      assets: true,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      builtAt: false,
      children: false,
      timings: false,
      version: false,
      excludeAssets: [/\.html/, /LICENSE/],
    },
  })

  console.log(
    JSON.stringify({
      vendor: {
        min: stats.assets.find((asset) => asset.name === stats.assetsByChunkName.vendor).size,
        minGzip: stats.assets.find((asset) => asset.name === `${stats.assetsByChunkName.vendor}.gz`).size,
      },
      main: {
        min: stats.assets.find((asset) => asset.name === stats.assetsByChunkName.main).size,
        minGzip: stats.assets.find((asset) => asset.name === `${stats.assetsByChunkName.main}.gz`).size,
      },
    }, null, 2)
  )
})
