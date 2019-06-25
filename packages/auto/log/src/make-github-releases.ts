import { TPrefixes, removeAutoNamePrefix, TWorkspacesOptions } from '@auto/utils'
import request from 'request-promise-native'
import { GITHUB_API_REPOS_URL } from './utils'
import { TGithubOptions, TLog } from './types'

export const makeGithubReleases = async (logs: TLog[], prefixes: TPrefixes, workspacesOptions: TWorkspacesOptions, githubOptions: TGithubOptions) => {
  if (typeof githubOptions.token !== 'string') {
    throw new Error('GitHub token is required')
  }

  for (const log of logs) {
    const name = removeAutoNamePrefix(log.name, workspacesOptions.autoNamePrefix)

    await request({
      uri: `${GITHUB_API_REPOS_URL}${githubOptions.username}/${githubOptions.repo}/releases`,
      method: 'POST',
      headers: {
        Authorization: `token ${githubOptions.token}`,
        'User-Agent': 'auto-tools',
      },
      json: {
        tag_name: `${name}@${log.version}`,
        name: `${name}@${log.version}`,
        body: log.messages
          .map((message) => `* ${prefixes.required[message.type].value} ${message.value}`)
          .join('\n'),
      },
    })
  }
}
