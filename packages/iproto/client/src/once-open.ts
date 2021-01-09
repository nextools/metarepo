/* eslint-disable @typescript-eslint/no-use-before-define */
import type WebSocket from 'ws'

export const onceOpen = (ws: WebSocket): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const onOpen = () => {
      ws.removeEventListener('open', onOpen)
      ws.removeEventListener('error', onError)
      resolve()
    }
    const onError = (event: WebSocket.ErrorEvent) => {
      ws.removeEventListener('error', onError)
      ws.removeEventListener('open', onOpen)
      reject(new Error(event.message))
    }

    ws.addEventListener('error', onError)
    ws.addEventListener('open', onOpen)
  })
