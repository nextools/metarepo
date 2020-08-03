import { isFunction } from 'tsfn'
import type { THook } from '../types'
import { logMessage as logMessageDefault, logError as logErrorDefault } from './log'
import { publishPackage } from './publish-package'
import { resolveNpmConfig } from './resolve-npm-config'

export type TPublishPackageConfig = {
  registry?: string,
  logMessage?: (message: string) => void,
  logError?: (message: string) => void,
}

export const publishPackages = (publishConfig: TPublishPackageConfig = {}): THook => {
  const logMessage = isFunction(publishConfig.logMessage) ? publishConfig.logMessage : logMessageDefault
  const logError = isFunction(publishConfig.logError) ? publishConfig.logError : logErrorDefault

  return async ({ packages, config }) => {
    for (const pkg of packages) {
      if (pkg.type === null || pkg.version === null) {
        continue
      }

      const npmConfig = await resolveNpmConfig(pkg.dir, config.npm, publishConfig.registry)

      await publishPackage(pkg, npmConfig, logMessage, logError)
    }
  }
}
