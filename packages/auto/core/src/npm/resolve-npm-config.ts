import type { TReadonly } from 'tsfn'
import { readPackage } from '../fs/read-package'
import type { TNpmConfig } from '../types'

const defaultConfig: TReadonly<Required<TNpmConfig>> = {
  registry: 'https://registry.npmjs.org/',
  publishSubDirectory: '',
  access: 'restricted',
}

export const resolveNpmConfig = async (packageDir: string, rootNpmConfig?: TNpmConfig, overrideRegistry?: string): Promise<Required<TNpmConfig>> => {
  const { auto: pkgAutoConfig = {} } = await readPackage(packageDir)

  const resultConfig = {
    ...defaultConfig,
    ...rootNpmConfig,
    ...pkgAutoConfig.npm,
  }

  if (typeof overrideRegistry !== 'undefined') {
    resultConfig.registry = overrideRegistry
  }

  return resultConfig
}
