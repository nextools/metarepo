import request from 'request-promise-native'
import { TPrefixes } from '@auto/utils'
import { SLACK_HOOKS_URL } from './utils'
import { TRepoLog, TSlackOptions } from './types'

export const sendRepoSlackMessage = async (log: TRepoLog, prefixes: TPrefixes, options: TSlackOptions) => {
  if (typeof options.token !== 'string') {
    throw new Error('Slack token is required')
  }

  await request({
    uri: `${SLACK_HOOKS_URL}${options.token}`,
    method: 'POST',
    json: {
      channel: options.channel,
      username: options.username,
      link_names: '1',
      icon_emoji: options.iconEmoji,
      unfurl_media: false,
      attachments: [{
        color: options.colors[log.type],
        fields: [
          {
            title: `v${log.version}`,
            value: log.messages
              .map((message) => `${prefixes.required[message.type].value} ${message.value}`)
              .join('\n'),
          },
        ],
      }],
    },
  })
}
