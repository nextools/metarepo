import path from 'path'
import execa from 'execa'
import { TReadonly, isFunction, isString } from 'tsfn'
import { TNpmConfig, TPackageRelease } from '../types'
import { TPublishPackageConfig } from './publish-packages'
import { logError } from './log-error'

type TPublishPackage = Pick<TPackageRelease, 'name' | 'dir'>

const NPM_ERROR = 'npm ERR!'

export const publishPackage = async (packageRelease: TReadonly<TPublishPackage>, npmConfig: TReadonly<Required<TNpmConfig>>, publishConfig: TPublishPackageConfig): Promise<void> => {
  try {
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
      stderr: 'pipe',
    })
  } catch (e) {
    if (isString(e.stderr) && e.stderr.includes(NPM_ERROR)) {
      if (isFunction(publishConfig.onError)) {
        publishConfig.onError(e.stderr)
      } else {
        logError(e.stderr)
      }
    }
  }
}
