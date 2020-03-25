import { TReadonly } from 'tsfn'
import { readPackage } from '../fs/read-package'
import { TNpmConfig } from '../types'

const defaultConfig: TReadonly<Required<TNpmConfig>> = {
  registry: 'https://registry.npmjs.com/',
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
