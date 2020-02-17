import fetch from 'node-fetch'
import { TPrefixes, TWorkspacesOptions, removeAutoNamePrefix } from '@auto/utils'
import { SLACK_HOOKS_URL, SLACK_MAX_ATTACHMENTS } from './utils'
import { TSlackOptions, TLog } from './types'

export const sendSlackMessage = async (logs: TLog[], prefixes: TPrefixes, workspacesOptions: TWorkspacesOptions, slackOptions: TSlackOptions) => {
  if (typeof slackOptions.token !== 'string') {
    throw new Error('Slack token is required')
  }

  const allAttachments = logs.map((log) => {
    const name = removeAutoNamePrefix(log.name, workspacesOptions.autoNamePrefix)

    return {
      color: slackOptions.colors[log.type],
      fields: [
        {
          title: `${name} v${log.version}`,
          value: log.messages
            .map((message) => {
              if (message.type === 'dependencies') {
                return `${prefixes.required[message.type].value} update dependencies`
              }

              return `${prefixes.required[message.type].value} ${message.value}`
            })
            .join('\n'),
        },
      ],
    }
  })
  const numIterations = Math.ceil(allAttachments.length / SLACK_MAX_ATTACHMENTS)
  const attachmentsInIteration = Math.ceil(allAttachments.length / numIterations)

  for (let i = 0; i < numIterations; ++i) {
    await fetch(
      `${SLACK_HOOKS_URL}${slackOptions.token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: slackOptions.channel,
          username: slackOptions.username,
          link_names: '1',
          icon_emoji: slackOptions.iconEmoji,
          unfurl_media: false,
          attachments: allAttachments.slice(
            i * attachmentsInIteration,
            Math.min((i + 1) * attachmentsInIteration, allAttachments.length)
          ),
        }),
      }
    )
  }
}
