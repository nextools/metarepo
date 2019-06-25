import path from 'path'
import execa from 'execa'
import { TPackageBump } from '@auto/utils'
import { getPackage } from '@auto/fs'
import { TNpmOptions } from './types'

export const publishPackage = async (bumpPackage: TPackageBump, npmOptions?: TNpmOptions) => {
  const packageJson = await getPackage(bumpPackage.dir)
  const options = {
    registry: 'https://registry.npmjs.org/',
    subDirectory: '',
    ...(packageJson.publishConfig && packageJson.publishConfig.registry && {
      registry: packageJson.publishConfig.registry,
    }),
    ...(npmOptions && npmOptions.registry && {
      registry: npmOptions.registry,
    }),
    ...(npmOptions && npmOptions.publishSubDirectory && {
      subDirectory: npmOptions.publishSubDirectory,
    }),
  }

  await execa('npm', ['publish', '--registry', options.registry, path.join(bumpPackage.dir, options.subDirectory)], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: null,
  })
}
