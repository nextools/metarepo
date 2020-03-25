import path from 'path'
import execa from 'execa'
import { TReadonly } from 'tsfn'
import { TNpmConfig, TPackageRelease } from '../types'

type TPublishPackage = Pick<TPackageRelease, 'name' | 'dir'>

export const publishPackage = async (packageRelease: TReadonly<TPublishPackage>, npmConfig: TReadonly<Required<TNpmConfig>>): Promise<void> => {
  await execa('npm', [
    'publish',
    '--registry',
    npmConfig.registry,
    '--access',
    npmConfig.access,
    path.join(packageRelease.dir, npmConfig.publishSubDirectory),
  ], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
  })
}
