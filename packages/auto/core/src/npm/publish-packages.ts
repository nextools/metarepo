import pAll from 'p-all'
import { isFunction } from 'tsfn'
import { THook } from '../types'
import { publishPackage } from './publish-package'
import { resolveNpmConfig } from './resolve-npm-config'
import { logError } from './log-error'

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
          try {
            const npmConfig = await resolveNpmConfig(pkg.dir, config.npm, publishConfig.registry)

            await publishPackage(pkg, npmConfig)
          } catch (e) {
            if (isFunction(publishConfig.onError)) {
              publishConfig.onError(e)
            } else {
              logError(e)
            }
          }
        }),
      { concurrency: 4 }
    )
  }
