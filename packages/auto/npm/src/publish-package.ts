import path from 'path'
import execa from 'execa'
import { TPackageBump } from '@auto/utils'
import { getPackage } from '@auto/fs'
import { TNpmOptions } from './types'

export const publishPackage = async (bumpPackage: TPackageBump, npmOptions?: TNpmOptions) => {
  const packageJson = await getPackage(bumpPackage.dir)
  const options = {
    registry: 'https://registry.npmjs.org/',
    publishSubDirectory: '',
    access: 'restricted',
  }

  if (packageJson.publishConfig && packageJson.publishConfig.registry) {
    options.registry = packageJson.publishConfig.registry
  }

  if (npmOptions && npmOptions.registry) {
    options.registry = npmOptions.registry
  }

  if (npmOptions && npmOptions.publishSubDirectory) {
    options.publishSubDirectory = npmOptions.publishSubDirectory
  }

  if (npmOptions && npmOptions.access) {
    options.access = npmOptions.access
  }

  await execa('npm', [
    'publish',
    '--registry',
    options.registry,
    '--access',
    options.access,
    path.join(bumpPackage.dir, options.publishSubDirectory),
  ], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: null,
  })
}
