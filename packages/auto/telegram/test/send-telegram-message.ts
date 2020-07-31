import type { TPackageRelease, TAutoConfig } from '@auto/core'
import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import type { TTelegramConfig } from '../src/types'
import { prefixes } from './prefixes'

const telegramOptions: TTelegramConfig = {
  token: 'token',
  chatId: 'chatId',
}

const config: TAutoConfig = {
  prefixes,
}

test('sendTelegramMessage', async (t) => {
  const spy = createSpy(() => Promise.resolve({ ok: true }))

  const unmockRequire = mockRequire('../src/send-telegram-message', {
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
        '@ns/a': '^0.1.0',
        b: '^0.1.0',
      },
      devDeps: null,
      messages: null,
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

  const { sendTelegramMessage } = await import('../src/send-telegram-message')

  await sendTelegramMessage(telegramOptions)({
    config,
    prefixes,
    packages,
  })

  t.deepEquals(
    getSpyCalls(spy),
    [
      [
        'https://api.telegram.org/bottoken/sendMessage',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: 'chatId',
            parse_mode: 'markdown',
            text:
`*ns/a v0.2.0*

🌱 minor commit
🐞 patch commit

*b v0.1.0*

🐣️ initial commit

*c v1.1.0*

♻️ update dependencies \`@ns/a\``,
          }),
        },
      ],
    ],
    'should make request'
  )

  unmockRequire()
})

test('sendTelegramMessage: truncate too long message', async (t) => {
  const spy = createSpy(() => Promise.resolve({ ok: true }))

  const unmockRequire = mockRequire('../src/send-telegram-message', {
    'node-fetch': {
      default: spy,
    },
    '../src/constants': {
      TELEGRAM_API_URL: 'https://api.telegram.org/',
      TELEGRAM_MESSAGE_MAX_LENGTH: 20,
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
      messages: null,
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

  const { sendTelegramMessage } = await import('../src/send-telegram-message')

  await sendTelegramMessage(telegramOptions)({
    config,
    prefixes,
    packages,
  })

  t.deepEquals(
    getSpyCalls(spy),
    [
      [
        'https://api.telegram.org/bottoken/sendMessage',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: 'chatId',
            parse_mode: 'markdown',
            text: '*ns/a v0.2.0*\n\n🌱 m…',
          }),
        },
      ],
    ],
    'should make request'
  )

  unmockRequire()
})

test('sendTelegramMessage: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve({ ok: true }))

  const unmockRequire = mockRequire('../src/send-telegram-message', {
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
      messages: null,
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

  const { sendTelegramMessage } = await import('../src/send-telegram-message')

  try {
    await sendTelegramMessage({
      ...telegramOptions,
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
      'Telegram token is required',
      'should throw correct error'
    )
  }

  unmockRequire()
})

test('sendTelegramMessage: throws if there was an API request error', async (t) => {
  const spy = createSpy(() => Promise.resolve({
    ok: false,
    statusText: 'oops',
  }))

  const unmockRequire = mockRequire('../src/send-telegram-message', {
    'node-fetch': {
      default: spy,
    },
  })

  const { sendTelegramMessage } = await import('../src/send-telegram-message')

  try {
    await sendTelegramMessage(telegramOptions)({
      config,
      prefixes,
      packages: [],
    })

    t.fail('should not get here')
  } catch (e) {
    t.equals(
      e.message,
      'oops',
      'should throw correct error'
    )
  }

  unmockRequire()
})
