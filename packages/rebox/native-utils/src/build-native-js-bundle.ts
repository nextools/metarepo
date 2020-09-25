import path from 'path'
import { spawnChildProcess } from 'spown'
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

  await spawnChildProcess(
    `haul bundle --config ${require.resolve('./haul.config.js')} --platform ${options.platform} --dev false --minify false --progress none --bundle-output ${bundlePath}`,
    {
      stdout: null,
      stderr: process.stderr,
      env: {
        REBOX_ENTRY_POINT: options.entryPointPath,
      },
    }
  )

  return bundlePath
}
