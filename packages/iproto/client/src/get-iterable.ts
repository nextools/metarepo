import WebSocket from 'isomorphic-ws'
import type { TJsonValue } from 'typeon'
import { jsonParse, jsonStringify } from 'typeon'
import { onceMessage } from './once-message'
import { onceOpen } from './once-open'
import type { TGetIterableOptions, TResponse } from './types'

export async function* getIterable <T extends TJsonValue>(options: TGetIterableOptions): AsyncGenerator<T, any, any> {
  const ws = new WebSocket(`ws://${options.host}:${options.port}/`)
  let isDone = false

  await onceOpen(ws)

  try {
    while (true) {
      const response = await onceMessage<TResponse>(
        ws,
        () => ws.send(jsonStringify({ type: 'REQUEST' })),
        (message: WebSocket.MessageEvent) => jsonParse<TResponse>((message.data) as string)
      )

      if (response.type === 'DONE') {
        ws.close()

        isDone = true

        break
      }

      const result = yield response.value

      ws.send(jsonStringify({ type: 'RESPONSE', value: result }))
    }
  } finally {
    if (!isDone && ws.readyState === ws.OPEN) {
      await onceMessage<void>(ws, () => ws.send(jsonStringify({ type: 'BREAK' })))
    }
  }
}
