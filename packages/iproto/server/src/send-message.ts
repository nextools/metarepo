import { isDefined } from 'tsfn'
import { jsonStringify } from 'typeon'
import type WebSocket from 'ws'

export const sendMessage = (ws: WebSocket, message: { [k: string]: any }): Promise<void> =>
  new Promise((resolve, reject) => {
    ws.send(jsonStringify(message), (err) => {
      if (isDefined(err)) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
