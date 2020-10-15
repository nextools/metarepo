import type { THook, TPackageRelease, TMessage, TLogReleaseType } from '@auto/core'
import fetch from 'node-fetch'
import { isString } from 'tsfn'
import type { TReadonly } from 'tsfn'
import { SLACK_HOOKS_URL, SLACK_MAX_ATTACHMENTS } from './constants'
import type { TSlackConfig } from './types'

export const sendSlackMessage = (slackConfig: TReadonly<TSlackConfig>): THook => async ({ packages, prefixes }) => {
  const compileMessages = (pkg: TReadonly<TPackageRelease>): string => {
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
      .map((message) => `${prefixes[message.type]} ${message.message}`)
      .join('\n')
  }

  if (!isString(slackConfig.token)) {
    throw new Error('Slack token is required')
  }

  const allAttachments = packages
    .reduce((res, pkg) => {
      if (pkg.type !== null && pkg.version !== null) {
        res.push({
          color: slackConfig.colors[pkg.type],
          fields: [{
            title: `${pkg.name} v${pkg.version}`,
            value: compileMessages(pkg),
          }],
        })
      }

      return res
    }, [] as any[])
  const numIterations = Math.ceil(allAttachments.length / SLACK_MAX_ATTACHMENTS)
  const attachmentsInIteration = Math.ceil(allAttachments.length / numIterations)

  for (let i = 0; i < numIterations; ++i) {
    await fetch(
      `${SLACK_HOOKS_URL}${slackConfig.token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: slackConfig.channel,
          username: slackConfig.username,
          link_names: '1',
          icon_emoji: slackConfig.iconEmoji,
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
