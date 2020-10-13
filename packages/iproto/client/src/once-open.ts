/* eslint-disable @typescript-eslint/no-use-before-define */
import type WebSocket from 'ws'

export const onceOpen = <T>(ws: WebSocket): Promise<T> =>
  new Promise((resolve, reject) => {
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
