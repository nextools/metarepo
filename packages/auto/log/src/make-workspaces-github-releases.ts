import { TPrefixes } from '@auto/utils'
import request from 'request-promise-native'
import { GITHUB_API_REPOS_URL } from './utils'
import { TGithubOptions, TWorkspacesLog } from './types'

export const makeWorkspacesGithubReleases = async (logs: TWorkspacesLog[], prefixes: TPrefixes, options: TGithubOptions) => {
  if (typeof options.token !== 'string') {
    throw new Error('GitHub token is required')
  }

  for (const log of logs) {
    await request({
      uri: `${GITHUB_API_REPOS_URL}${options.username}/${options.repo}/releases`,
      method: 'POST',
      headers: {
        Authorization: `token ${options.token}`,
        'User-Agent': 'auto-tools',
      },
      json: {
        tag_name: `${log.name}@${log.version}`,
        name: `${log.name}@${log.version}`,
        body: log.messages
          .map((message) => `* ${prefixes.required[message.type].value} ${message.value}`)
          .join('\n'),
      },
    })
  }
}
