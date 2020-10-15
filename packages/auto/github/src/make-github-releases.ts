import type { THook, TMessage, TLogReleaseType } from '@auto/core'
import fetch from 'node-fetch'
import pAll from 'p-all'
import { isString } from 'tsfn'
import type { TReadonly } from 'tsfn'
import { GITHUB_API_REPOS_URL } from './constants'
import type { TGithubConfig } from './types'

export const makeGithubReleases = (githubConfig: TReadonly<TGithubConfig>): THook => async ({ packages, prefixes }) => {
  if (!isString(githubConfig.token)) {
    throw new Error('GitHub token is required')
  }

  await pAll(
    packages.map((pkg) => async (): Promise<void> => {
      if (pkg.version === null) {
        return
      }

      const compileMessages = (): string => {
        let result = (pkg.messages ?? []) as TMessage<TLogReleaseType>[]

        if (pkg.deps !== null && pkg.type !== 'initial') {
          const depNames = Object.keys(pkg.deps)
            .filter((name) => Boolean(packages.find((pkg) => pkg.name === name)?.type !== 'initial'))

          if (depNames.length > 0) {
            result = result.concat({
              type: 'dependencies',
              message: `update dependencies \`${depNames.join('`, `')}\``,
            })
          }
        }

        return result
          .map((message) => `* ${prefixes[message.type]} ${message.message}`)
          .join('\n')
      }

      await fetch(
        `${GITHUB_API_REPOS_URL}${githubConfig.username}/${githubConfig.repo}/releases`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${githubConfig.token}`,
            'User-Agent': 'auto-tools',
          },
          body: JSON.stringify({
            tag_name: `${pkg.name}@${pkg.version}`,
            name: `${pkg.name}@${pkg.version}`,
            body: compileMessages(),
          }),
        }
      )
    }),
    { concurrency: 2 }
  )
}
