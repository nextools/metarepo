import type { TJsonValue } from 'typeon'
import { jsonParse } from 'typeon'
import WebSocket from 'ws'
import { closeServer } from './close-server'
import { sendMessage } from './send-message'
import type { TMessage, TServeIterableOptions } from './types'

export const serveIterable = <T extends TJsonValue>(iterable: AsyncIterable<T>, options: TServeIterableOptions): Promise<() => Promise<void>> =>
  new Promise((resolve, reject) => {
    const iterator = iterable[Symbol.asyncIterator]()

    const wss = new WebSocket.Server({
      host: options.host,
      port: options.port,
    })

    wss.on('connection', (ws) => {
      ws.on('error', reject)

      let pResponse: Promise<any>
      let pResponseResolver: (arg: any) => void

      ws.on('message', async (data: string) => {
        try {
          const message = jsonParse<TMessage>(data)

          switch (message.type) {
            case 'REQUEST': {
              const response = await pResponse
              const result = await iterator.next(response)

              if (result.done) {
                await sendMessage(ws, { type: 'DONE' })
                await closeServer(wss)
              } else {
                pResponse = new Promise((resolve) => {
                  pResponseResolver = resolve
                })

                await sendMessage(ws, { type: 'RESPONSE', value: result.value })
              }

              break
            }

            case 'RESPONSE': {
              pResponseResolver(message.value)

              break
            }

            case 'BREAK': {
              await iterator.return?.()
              await sendMessage(ws, { type: 'BREAK' })
              await closeServer(wss)

              break
            }
          }
        } catch (e) {
          reject(e)
        }
      })
    })

    wss.on('listening', () => resolve(() => closeServer(wss)))
    wss.on('error', reject)
  })
