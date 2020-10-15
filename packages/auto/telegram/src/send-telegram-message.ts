import type { THook, TMessage, TLogReleaseType, TPackageRelease } from '@auto/core'
import fetch from 'node-fetch'
import type { TReadonly } from 'tsfn'
import { TELEGRAM_MESSAGE_MAX_LENGTH, TELEGRAM_API_URL } from './constants'
import type { TTelegramConfig } from './types'

export const sendTelegramMessage = (telegramConfig: TReadonly<TTelegramConfig>): THook => async ({ packages, prefixes }) => {
  if (typeof telegramConfig.token !== 'string') {
    throw new Error('Telegram token is required')
  }

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

  let data = packages
    .filter((pkg) => pkg.version !== null)
    .map((pkg) => `*${pkg.name} v${pkg.version}*\n\n${compileMessages(pkg)}`)
    .join('\n\n')

  if (data.length > TELEGRAM_MESSAGE_MAX_LENGTH) {
    data = `${data.slice(0, TELEGRAM_MESSAGE_MAX_LENGTH - 1)}…`
  }

  const response = await fetch(
    `${TELEGRAM_API_URL}bot${telegramConfig.token}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramConfig.chatId,
        parse_mode: 'markdown',
        text: data,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(response.statusText)
  }
}
