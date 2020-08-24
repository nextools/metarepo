import http from 'http'
import { URL } from 'url'
import { isDefined } from 'tsfn'
import { SERVER_HOST, SERVER_PORT } from './constants'

export const runServer = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      if (isDefined(req.url)) {
        const url = new URL(req.url, `http://${SERVER_HOST}:${SERVER_PORT}/`)

        if (url.pathname === '/') {
          res.end()

          await new Promise((serverResolve) => {
            server.close((err) => {
              if (isDefined(err)) {
                reject(err)
              } else {
                serverResolve()
              }
            })
          })

          const count = Number(url.searchParams.get('count'))

          resolve(count)
        }
      }
    })

    server.on('error', reject)
    server.listen(SERVER_PORT, SERVER_HOST)
  })
