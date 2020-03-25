import fetch from 'node-fetch'
import { THook } from '@auto/core'
import { TReadonly } from 'tsfn'
import { TELEGRAM_MESSAGE_MAX_LENGTH, TELEGRAM_API_URL } from './constants'
import { compileMessages } from './compile-messages'
import { TTelegramConfig } from './types'

export const sendTelegramMessage = (telegramConfig: TReadonly<TTelegramConfig>): THook => async ({ packages, prefixes }) => {
  if (typeof telegramConfig.token !== 'string') {
    throw new Error('Telegram token is required')
  }

  let data = packages
    .filter((pkg) => pkg.version !== null)
    .map((pkg) => `*${pkg.name} v${pkg.version}*\n\n${compileMessages(pkg, prefixes)}`)
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
