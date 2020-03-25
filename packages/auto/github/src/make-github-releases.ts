import pAll from 'p-all'
import fetch from 'node-fetch'
import { THook, TPackageRelease, TRequiredPrefixes } from '@auto/core'
import { isString, TReadonly } from 'tsfn'
import { GITHUB_API_REPOS_URL } from './constants'
import { compileMessages } from './compile-messages'
import { TGithubConfig } from './types'

const makeGithubRelease = (config: TGithubConfig, prefixes: TRequiredPrefixes) => (pkg: TReadonly<TPackageRelease>) => async (): Promise<void> => {
  if (pkg.version === null) {
    return
  }

  await fetch(
    `${GITHUB_API_REPOS_URL}${config.username}/${config.repo}/releases`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${config.token}`,
        'User-Agent': 'auto-tools',
      },
      body: JSON.stringify({
        tag_name: `${pkg.name}@${pkg.version}`,
        name: `${pkg.name}@${pkg.version}`,
        body: compileMessages(pkg, prefixes),
      }),
    }
  )
}

export const makeGithubReleases = (githubConfig: TReadonly<TGithubConfig>): THook => async ({ packages, prefixes }) => {
  if (!isString(githubConfig.token)) {
    throw new Error('GitHub token is required')
  }

  const maker = makeGithubRelease(githubConfig, prefixes)

  await pAll(
    packages.map(maker),
    { concurrency: 2 }
  )
}
