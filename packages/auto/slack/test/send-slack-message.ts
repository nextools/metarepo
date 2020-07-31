import type { TPackageRelease, TAutoConfig } from '@auto/core'
import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import type { TSlackConfig } from '../src/types'
import { prefixes } from './prefixes'

const slackConfig: TSlackConfig = {
  token: 'token',
  username: 'username',
  channel: 'channel',
  iconEmoji: 'emoji',
  colors: {
    initial: 'initial',
    major: 'major',
    minor: 'minor',
    patch: 'patch',
  },
}

const config: TAutoConfig = {
  prefixes,
}

test('sendSlackMessage', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../src/send-slack-message', {
    'node-fetch': {
      default: spy,
    },
  })

  const packages: TPackageRelease[] = [
    {
      name: 'ns/a',
      dir: 'fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
      },
      version: '0.2.0',
      type: 'minor',
      deps: null,
      devDeps: null,
      messages: [
        {
          type: 'minor',
          message: 'minor commit',
        },
        {
          type: 'patch',
          message: 'patch commit',
        },
      ],
    },
    {
      name: 'b',
      dir: 'fakes/b',
      json: {
        name: 'b',
        version: '0.0.0',
      },
      version: '0.1.0',
      type: 'initial',
      deps: {
        '@ns/a': '^0.2.0',
      },
      devDeps: null,
      messages: [
        {
          type: 'initial',
          message: 'initial commit',
        },
      ],
    },
    {
      name: 'c',
      dir: 'fakes/c',
      json: {
        name: 'c',
        version: '1.0.0',
      },
      version: '1.1.0',
      type: 'minor',
      deps: {
        b: '^0.1.0',
      },
      devDeps: null,
      messages: [
        {
          type: 'minor',
          message: 'minor commit',
        },
      ],
    },
    {
      name: 'd',
      dir: 'fakes/d',
      json: {
        name: 'd',
        version: '1.0.0',
      },
      version: null,
      type: null,
      deps: null,
      devDeps: {
        b: '^0.1.0',
      },
      messages: null,
    },
  ]

  const { sendSlackMessage } = await import('../src/send-slack-message')

  await sendSlackMessage(slackConfig)({
    config,
    prefixes,
    packages,
  })

  t.deepEquals(
    getSpyCalls(spy),
    [
      [
        'https://hooks.slack.com/services/token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: 'channel',
            username: 'username',
            link_names: '1',
            icon_emoji: 'emoji',
            unfurl_media: false,
            attachments: [
              {
                color: 'minor',
                fields: [{
                  title: 'ns/a v0.2.0',
                  value: '🌱 minor commit\n🐞 patch commit',
                }],
              },
              {
                color: 'initial',
                fields: [{
                  title: 'b v0.1.0',
                  value: '🐣️ initial commit',
                }],
              },
              {
                color: 'minor',
                fields: [{
                  title: 'c v1.1.0',
                  value: '🌱 minor commit',
                }],
              },
            ],
          }),
        },
      ],
    ],
    'should make request'
  )

  unmockRequire()
})

test('sendSlackMessage: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../src/send-slack-message', {
    'node-fetch': {
      default: spy,
    },
  })

  const packages: TPackageRelease[] = [{
    name: 'a',
    version: '0.1.0',
    type: 'minor',
    dir: 'dir',
    json: {
      name: 'a',
      version: '0.0.1',
    },
    deps: null,
    devDeps: null,
    messages: [
      { type: 'minor', message: 'minor' },
      { type: 'patch', message: 'patch' },
    ],
  }, {
    name: 'b',
    version: '1.2.0',
    type: 'minor',
    dir: 'dir',
    json: {
      name: 'b',
      version: '1.1.2',
    },
    deps: null,
    devDeps: null,
    messages: [
      { type: 'minor', message: 'minor' },
      { type: 'patch', message: 'patch' },
    ],
  }]

  const { sendSlackMessage } = await import('../src/send-slack-message')

  try {
    await sendSlackMessage({
      ...slackConfig,
      token: undefined as any,
    })({
      config,
      prefixes,
      packages,
    })

    t.fail('should not get here')
  } catch (e) {
    t.equals(
      e.message,
      'Slack token is required',
      'should throw correct error'
    )
  }

  unmockRequire()
})

test('sendSlackMessage: multiple messages', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  const unmockRequire = mockRequire('../src/send-slack-message', {
    'node-fetch': {
      default: spy,
    },
    '../src/constants': {
      SLACK_HOOKS_URL: 'https://hooks.slack.com/services/',
      SLACK_MAX_ATTACHMENTS: 3,
    },
  })

  const packages: TPackageRelease[] = [{
    name: 'ns/a',
    version: '0.1.0',
    type: 'minor',
    dir: 'dir',
    json: {
      name: '@ns/a',
      version: '0.0.0',
    },
    deps: null,
    devDeps: null,
    messages: [{ type: 'minor', message: 'minor' }],
  }, {
    name: 'b',
    version: '1.2.0',
    type: 'minor',
    dir: 'dir',
    json: {
      name: 'b',
      version: '1.1.2',
    },
    deps: null,
    devDeps: null,
    messages: [{ type: 'minor', message: 'minor' }],
  }, {
    name: 'ns/c',
    version: '1.2.0',
    type: 'minor',
    dir: 'dir',
    json: {
      name: '@ns/c',
      version: '1.1.2',
    },
    deps: null,
    devDeps: null,
    messages: [{ type: 'minor', message: 'minor' }],
  }, {
    name: 'd',
    version: '1.2.0',
    type: 'minor',
    dir: 'dir',
    json: {
      name: 'd',
      version: '1.1.2',
    },
    deps: null,
    devDeps: null,
    messages: [{ type: 'minor', message: 'minor' }],
  }, {
    name: 'ns/e',
    version: '1.2.0',
    type: 'minor',
    dir: 'dir',
    json: {
      name: '@ns/e',
      version: '1.1.2',
    },
    deps: null,
    devDeps: null,
    messages: [{ type: 'minor', message: 'minor' }],
  }]

  const { sendSlackMessage } = await import('../src/send-slack-message')

  await sendSlackMessage(slackConfig)({
    config,
    prefixes,
    packages,
  })

  t.deepEquals(
    getSpyCalls(spy),
    [
      [
        'https://hooks.slack.com/services/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channel: 'channel',
            username: 'username',
            link_names: '1',
            icon_emoji: 'emoji',
            unfurl_media: false,
            attachments: [
              {
                color: 'minor',
                fields: [{
                  title: 'ns/a v0.1.0',
                  value: `${prefixes.minor} minor`,
                }],
              },
              {
                color: 'minor',
                fields: [{
                  title: 'b v1.2.0',
                  value: `${prefixes.minor} minor`,
                }],
              },
              {
                color: 'minor',
                fields: [{
                  title: 'ns/c v1.2.0',
                  value: `${prefixes.minor} minor`,
                }],
              },
            ],
          }),
        },
      ],
      [
        'https://hooks.slack.com/services/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channel: 'channel',
            username: 'username',
            link_names: '1',
            icon_emoji: 'emoji',
            unfurl_media: false,
            attachments: [
              {
                color: 'minor',
                fields: [{
                  title: 'd v1.2.0',
                  value: `${prefixes.minor} minor`,
                }],
              },
              {
                color: 'minor',
                fields: [{
                  title: 'ns/e v1.2.0',
                  value: `${prefixes.minor} minor`,
                }],
              },
            ],
          }),
        },
      ],
    ],
    'should make multiple requests'
  )

  unmockRequire()
})
