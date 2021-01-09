import http from 'http'
import { URL } from 'url'
import { isDefined } from 'tsfn'
import { SERVER_HOST, SERVER_PORT } from './constants'
import type { TPerfData } from './types'

export const runServer = (): Promise<TPerfData> =>
  new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      if (isDefined(req.url)) {
        const url = new URL(req.url, `http://${SERVER_HOST}:${SERVER_PORT}/`)

        if (url.pathname === '/') {
          res.end()

          await new Promise<void>((serverResolve) => {
            server.close((err) => {
              if (isDefined(err)) {
                reject(err)
              } else {
                serverResolve()
              }
            })
          })

          const viewCount = Number(url.searchParams.get('viewCount'))
          const usedMemory = Number(url.searchParams.get('usedMemory'))

          resolve({ viewCount, usedMemory })
        }
      }
    })

    server.on('error', reject)
    server.listen(SERVER_PORT, SERVER_HOST)
  })
