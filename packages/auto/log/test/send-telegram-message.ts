import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock } from 'mocku'
import { prefixes } from '@auto/utils/test/prefixes'
import { TWorkspacesOptions } from '@auto/utils'
import { TTelegramOptions } from '../src/types'

const telegramOptions: TTelegramOptions = {
  token: 'token',
  chatId: 'chatId',
}
const workspacesOptions: TWorkspacesOptions = {
  autoNamePrefix: '@ns/',
}

test('sendTelegramMessage', async (t) => {
  const spy = createSpy(() => Promise.resolve({ ok: true }))

  const unmock = mock('../src/send-telegram-message', {
    'node-fetch': {
      default: spy,
    },
  })

  const { sendTelegramMessage } = await import('../src/send-telegram-message')

  await sendTelegramMessage(
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
            value: 'update dependencies: `c`',
          },
        ],
      },
    ],
    prefixes,
    workspacesOptions,
    telegramOptions
  )

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
            text: '*a v0.1.2*\n\n🌱 minor\n🐞 patch\n\n*b v1.2.3*\n\n🌱 minor\n🐞 patch\n♻️ update dependencies: `c`',
          }),
        },
      ],
    ],
    'should make request'
  )

  unmock()
})

test('sendTelegramMessage: truncate too long message', async (t) => {
  const spy = createSpy(() => Promise.resolve({ ok: true }))

  const unmock = mock('../src/send-telegram-message', {
    'node-fetch': {
      default: spy,
    },
    './utils': {
      TELEGRAM_API_URL: 'https://api.telegram.org/',
      TELEGRAM_MESSAGE_MAX_LENGTH: 20,
    },
  })

  const { sendTelegramMessage } = await import('../src/send-telegram-message')

  await sendTelegramMessage(
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
            value: 'update dependencies: `c`',
          },
        ],
      },
    ],
    prefixes,
    workspacesOptions,
    telegramOptions
  )

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
            text: '*a v0.1.2*\n\n🌱 mino…',
          }),
        },
      ],
    ],
    'should make request'
  )

  unmock()
})

test('sendTelegramMessage: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve({ ok: true }))

  const unmock = mock('../src/send-telegram-message', {
    'node-fetch': {
      default: spy,
    },
  })

  const { sendTelegramMessage } = await import('../src/send-telegram-message')

  try {
    await sendTelegramMessage(
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
              value: 'update dependencies: `c`',
            },
          ],
        },
      ],
      prefixes,
      workspacesOptions,
      {
        ...telegramOptions,
        // @ts-ignore
        token: undefined,
      }
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(
      e.message,
      'Telegram token is required',
      'should throw correct error'
    )
  }

  unmock()
})

test('sendTelegramMessage: throws if there was an API request error', async (t) => {
  const spy = createSpy(() => Promise.resolve({
    ok: false,
    statusText: 'oops',
  }))

  const unmock = mock('../src/send-telegram-message', {
    'node-fetch': {
      default: spy,
    },
  })

  const { sendTelegramMessage } = await import('../src/send-telegram-message')

  try {
    await sendTelegramMessage(
      [],
      prefixes,
      workspacesOptions,
      telegramOptions
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(
      e.message,
      'oops',
      'should throw correct error'
    )
  }

  unmock()
})
