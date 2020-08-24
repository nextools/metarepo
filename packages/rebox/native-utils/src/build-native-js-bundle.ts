import path from 'path'
import execa from 'execa'
import type { TPlatform } from './types'

export type TBuildJsBundleOptions = {
  entryPointPath: string,
  outputPath: string,
  platform: TPlatform,
}

export const buildNativeJsBundle = async (options: TBuildJsBundleOptions) => {
  const bundlePath = path.join(
    options.outputPath,
    options.platform === 'ios' ? 'main.jsbundle' : 'index.android.bundle'
  )

  await execa(
    'haul',
    [
      'bundle',
      '--config',
      require.resolve('./haul.config.js'),
      '--platform',
      options.platform,
      '--dev',
      'false',
      '--minify',
      'false',
      '--progress',
      'none',
      '--bundle-output',
      bundlePath,
    ],
    {
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
        REBOX_ENTRY_POINT: options.entryPointPath,
      },
    }
  )

  return bundlePath
}
