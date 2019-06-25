import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'
import { prefixes } from '@auto/utils/test/prefixes'
import { TWorkspacesOptions } from '@auto/utils'
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
const workspacesOptions: TWorkspacesOptions = {
  autoNamePrefix: '@ns/',
}

test('sendSlackMessage', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/send-slack-message', {
    'request-promise-native': {
      default: spy,
    },
  })

  const { sendSlackMessage } = await import('../src/send-slack-message')

  await sendSlackMessage(
    [
      {
        name: '@ns/a',
        version: '0.1.2',
        type: 'minor',
        dir: 'dir',
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
      {
        name: 'b',
        version: '1.2.3',
        type: 'minor',
        dir: 'dir',
        messages: [
          {
            type: 'minor',
            value: 'minor',
          },
          {
            type: 'patch',
            value: 'patch',
          },
          {
            type: 'dependencies',
            value: 'update dependencies',
          },
        ],
      },
    ],
    prefixes,
    workspacesOptions,
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
          attachments: [
            {
              color: 'minor',
              fields: [{
                title: 'a v0.1.2',
                value: `${prefixes.required.minor.value} minor\n${prefixes.required.patch.value} patch`,
              }],
            },
            {
              color: 'minor',
              fields: [{
                title: 'b v1.2.3',
                value: `${prefixes.required.minor.value} minor\n${prefixes.required.patch.value} patch\n${prefixes.required.dependencies.value} update dependencies`,
              }],
            },
          ],
        },
      }],
    ],
    'should make request'
  )

  unmock('../src/send-slack-message')
})

test('sendSlackMessage: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/send-slack-message', {
    'request-promise-native': {
      default: spy,
    },
  })

  const { sendSlackMessage } = await import('../src/send-slack-message')

  try {
    await sendSlackMessage(
      [
        {
          name: 'a',
          version: '0.1.2',
          type: 'minor',
          dir: 'dir',
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
        {
          name: 'b',
          version: '1.2.3',
          type: 'minor',
          dir: 'dir',
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
      ],
      prefixes,
      workspacesOptions,
      // @ts-ignore
      { ...slackOptions, token: undefined }
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Slack token is required')
  }

  unmock('../src/send-slack-message')
})

test('sendSlackMessage', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/send-slack-message', {
    'request-promise-native': {
      default: spy,
    },
    './utils': {
      SLACK_HOOKS_URL: 'https://hooks.slack.com/services/',
      MAX_ATTACHMENTS: 3,
    },
  })

  const { sendSlackMessage } = await import('../src/send-slack-message')

  await sendSlackMessage(
    [
      {
        name: '@ns/a',
        version: '0.1.2',
        type: 'minor',
        dir: 'dir',
        messages: [
          {
            type: 'minor',
            value: 'minor',
          },
        ],
      },
      {
        name: 'b',
        version: '1.2.3',
        type: 'minor',
        dir: 'dir',
        messages: [
          {
            type: 'minor',
            value: 'minor',
          },
        ],
      },
      {
        name: '@ns/c',
        version: '1.2.3',
        type: 'minor',
        dir: 'dir',
        messages: [
          {
            type: 'minor',
            value: 'minor',
          },
        ],
      },
      {
        name: 'd',
        version: '1.2.3',
        type: 'minor',
        dir: 'dir',
        messages: [
          {
            type: 'minor',
            value: 'minor',
          },
        ],
      },
      {
        name: '@ns/e',
        version: '1.2.3',
        type: 'minor',
        dir: 'dir',
        messages: [
          {
            type: 'minor',
            value: 'minor',
          },
        ],
      },
    ],
    prefixes,
    workspacesOptions,
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
          attachments: [
            {
              color: 'minor',
              fields: [{
                title: 'a v0.1.2',
                value: `${prefixes.required.minor.value} minor`,
              }],
            },
            {
              color: 'minor',
              fields: [{
                title: 'b v1.2.3',
                value: `${prefixes.required.minor.value} minor`,
              }],
            },
            {
              color: 'minor',
              fields: [{
                title: 'c v1.2.3',
                value: `${prefixes.required.minor.value} minor`,
              }],
            },
          ],
        },
      }],
      [{
        uri: 'https://hooks.slack.com/services/token',
        method: 'POST',
        json: {
          channel: 'channel',
          username: 'username',
          link_names: '1',
          icon_emoji: 'emoji',
          unfurl_media: false,
          attachments: [
            {
              color: 'minor',
              fields: [{
                title: 'd v1.2.3',
                value: `${prefixes.required.minor.value} minor`,
              }],
            },
            {
              color: 'minor',
              fields: [{
                title: 'e v1.2.3',
                value: `${prefixes.required.minor.value} minor`,
              }],
            },
          ],
        },
      }],
    ],
    'should make request'
  )

  unmock('../src/send-slack-message')
})
