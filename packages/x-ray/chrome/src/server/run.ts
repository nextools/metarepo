import http from 'http'
import url, { UrlWithParsedQuery } from 'url'
import { isDefined } from 'tsfn'
import { unchunkJson } from 'unchunk'
import { TResults, TGetResponseQuery } from '../types'
import { getList } from './get-list'
import { getBuffer } from './get-buffer'
import { save } from './save'

const SERVER_HOST = 'localhost'
const SERVER_PORT = 3001
const UI_HOST = 'localhost'
const UI_PORT = 3000

export const runServer = (results: TResults, onClose: () => Promise<void>) => new Promise<void>((resolve, reject) => {
  const pathMap = new Map<string, string>()

  const server = http
    .createServer(async (req, res) => {
      try {
        res.setHeader('Access-Control-Allow-Origin', `http://${UI_HOST}:${UI_PORT}`)

        if (isDefined(req.url)) {
          const urlData = url.parse(req.url, true) as UrlWithParsedQuery & {
            query: TGetResponseQuery,
          }

          if (req.method === 'GET' && urlData.pathname === '/list') {
            const list = await getList(results, pathMap)

            res.end(JSON.stringify(list))

            return
          }

          if (req.method === 'GET' && urlData.pathname === '/get') {
            const buffer = getBuffer(results, pathMap, urlData.query)

            if (buffer === null) {
              throw new Error(`Invalid get request: ${req.url}`)
            }

            res.setHeader('Content-Type', 'image/png')
            res.end(buffer, 'binary')

            return
          }

          if (req.method === 'POST' && req.url === '/save') {
            const keys = await unchunkJson<string[]>(req)

            await save(results, pathMap, keys)

            res.end()
            server.close()

            await onClose()

            return
          }
        }

        res.end()
      } catch (e) {
        // TODO: reject
        console.error(e)
      }
    })
    .on('error', reject)
    .listen(SERVER_PORT, SERVER_HOST, () => {
      resolve()
    })
})
