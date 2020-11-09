import path from 'path'
import { spawnChildProcess } from 'spown'
import { isString } from 'tsfn'
import type { TReadonly } from 'tsfn'
import { makeRetryPrompt } from '../prompt/make-retry-prompt'
import type { TNpmConfig, TPackageRelease } from '../types'

type TPublishPackage = Pick<TPackageRelease, 'name' | 'dir' | 'version'>

const isNpmAlreadyExistsError = (err: unknown) => isString(err) && err.includes('previously published versions')

export const publishPackage = async (packageRelease: TReadonly<TPublishPackage>, npmConfig: TReadonly<Required<TNpmConfig>>, logMessage: (message: string) => void, logError: (err: string) => void): Promise<void> => {
  const invokePublish = () =>
    spawnChildProcess(
      `npm publish --registry ${npmConfig.registry} --access ${npmConfig.access} ${path.join(packageRelease.dir, npmConfig.publishSubDirectory)}`,
      {
        stdin: process.stdin,
        stdout: process.stdout,
      }
    )

  let shouldRetry = true

  do {
    try {
      await invokePublish()

      shouldRetry = false
    } catch (e) {
      if (isNpmAlreadyExistsError(e.message)) {
        logMessage(`Package "${packageRelease.name}@${packageRelease.version}" has already been published`)

        shouldRetry = false
      } else {
        logError(e.message.trim())

        await makeRetryPrompt()

        shouldRetry = true
      }
    }
  } while (shouldRetry)
}
