import request from 'request-promise-native'
import { TPrefixes } from '@auto/utils'
import { SLACK_HOOKS_URL, MAX_ATTACHMENTS } from './utils'
import { TSlackOptions, TWorkspacesLog } from './types'

export const sendWorkspacesSlackMessage = async (logs: TWorkspacesLog[], prefixes: TPrefixes, options: TSlackOptions) => {
  if (typeof options.token !== 'string') {
    throw new Error('Slack token is required')
  }

  const allAttachments = logs.map((bump) => ({
    color: options.colors[bump.type],
    fields: [
      {
        title: `${bump.name} v${bump.version}`,
        value: bump.messages
          .map((message) => `${prefixes.required[message.type].value} ${message.value}`)
          .join('\n'),
      },
    ],
  }))
  const numIterations = Math.ceil(allAttachments.length / MAX_ATTACHMENTS)
  const attachmentsInIteration = Math.ceil(allAttachments.length / numIterations)

  for (let i = 0; i < numIterations; ++i) {
    await request({
      uri: `${SLACK_HOOKS_URL}${options.token}`,
      method: 'POST',
      json: {
        channel: options.channel,
        username: options.username,
        link_names: '1',
        icon_emoji: options.iconEmoji,
        unfurl_media: false,
        attachments: allAttachments.slice(
          i * attachmentsInIteration,
          Math.min((i + 1) * attachmentsInIteration, allAttachments.length)
        ),
      },
    })
  }
}
