/* eslint-disable @typescript-eslint/no-use-before-define */
import type WebSocket from 'ws'

export const onceMessage = <T>(ws: WebSocket, onSubscribe: () => void, onData?: (data: any) => T): Promise<T> =>
  new Promise<any>((resolve, reject) => {
    const onMessage = (data: WebSocket.MessageEvent) => {
      ws.removeEventListener('message', onMessage)
      ws.removeEventListener('close', onClose)

      resolve(onData?.(data))
    }
    const onClose = (event: WebSocket.CloseEvent) => {
      ws.removeEventListener('close', onClose)
      ws.removeEventListener('message', onMessage)

      // seems like this one should never happen here
      // if (event.wasClean) {}

      reject(new Error(`iproto: WebSocket has been closed with code ${event.code}`))
    }

    ws.addEventListener('close', onClose)
    ws.addEventListener('message', onMessage)

    onSubscribe()
  })
