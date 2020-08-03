import pAll from 'p-all'
import type { THook } from '../types'
import { publishPackage } from './publish-package'
import { resolveNpmConfig } from './resolve-npm-config'

export type TPublishPackageConfig = {
  registry?: string,
  onError?: (e: Error) => void,
}

export const publishPackages = (publishConfig: TPublishPackageConfig = {}): THook =>
  async ({ packages, config }) => {
    await pAll(
      packages
        .filter((pkg) => pkg.type !== null && pkg.version !== null)
        .map((pkg) => async () => {
          const npmConfig = await resolveNpmConfig(pkg.dir, config.npm, publishConfig.registry)

          await publishPackage(pkg, npmConfig, publishConfig)
        }),
      { concurrency: 4 }
    )
  }
