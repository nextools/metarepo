import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'
import { prefixes } from '@auto/utils/test/prefixes'
import { TSlackOptions } from '../src/types'

const slackOptions: TSlackOptions = {
  token: 'token',
  username: 'username',
  channel: 'channel',
  iconEmoji: 'emoji',
  colors: {
    major: 'major',
    minor: 'minor',
    patch: 'patch',
  },
}

test('sendRepoSlackMessage', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/send-repo-slack-message', {
    'request-promise-native': {
      default: spy,
    },
  })

  const { sendRepoSlackMessage } = await import('../src/send-repo-slack-message')

  await sendRepoSlackMessage(
    {
      version: '0.1.2',
      type: 'minor',
      messages: [
        {
          type: 'minor',
          value: 'minor',
        },
        {
          type: 'patch',
          value: 'patch',
        },
      ],
    },
    prefixes,
    slackOptions
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{
        uri: 'https://hooks.slack.com/services/token',
        method: 'POST',
        json: {
          channel: 'channel',
          username: 'username',
          link_names: '1',
          icon_emoji: 'emoji',
          unfurl_media: false,
          attachments: [{
            color: 'minor',
            fields: [{
              title: 'v0.1.2',
              value: `${prefixes.required.minor.value} minor\n${prefixes.required.patch.value} patch`,
            }],
          }],
        },
      }],
    ],
    'should make request'
  )

  unmock('../src/send-repo-slack-message')
})

test('sendRepoSlackMessage: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/send-repo-slack-message', {
    'request-promise-native': {
      default: spy,
    },
  })

  const { sendRepoSlackMessage } = await import('../src/send-repo-slack-message')

  try {
    await sendRepoSlackMessage(
      {
        version: '0.1.2',
        type: 'minor',
        messages: [
          {
            type: 'minor',
            value: 'minor',
          },
          {
            type: 'patch',
            value: 'patch',
          },
        ],
      },
      prefixes,
      // @ts-ignore
      { ...slackOptions, token: undefined }
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Slack token is required')
  }

  unmock('../src/send-repo-slack-message')
})
