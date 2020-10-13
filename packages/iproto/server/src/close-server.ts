import { isDefined } from 'tsfn'
import type { Server } from 'ws'

export const closeServer = (wss: Server): Promise<void> =>
  new Promise((resolve, reject) => {
    wss.close((err) => {
      if (isDefined(err)) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
