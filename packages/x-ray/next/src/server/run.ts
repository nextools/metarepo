import http from 'http'
import url, { UrlWithParsedQuery } from 'url'
import { isDefined } from 'tsfn'
import { unchunkJson } from 'unchunk'
import { TGetResponseQuery, TTotalResults } from '../types'
import { UI_HOST, UI_PORT, SERVER_PORT, SERVER_HOST } from '../constants'
import { getList } from './get-list'
import { getBuffer } from './get-buffer'
import { save } from './save'

export const runServer = (totalResults: TTotalResults, type: string) => new Promise<() => Promise<void>>((serverResolve, serverReject) => {
  const pathsMap = new Map<string, string>()

  for (const [key, value] of totalResults) {
    pathsMap.set(key, value.name)
    pathsMap.set(value.name, key)
  }

  const savePromise = new Promise<void>((saveResolve, saveReject) => {
    const server = http
      .createServer(async (req, res) => {
        try {
          res.setHeader('Access-Control-Allow-Origin', `http://${UI_HOST}:${UI_PORT}`)

          if (isDefined(req.url)) {
            const urlData = url.parse(req.url, true) as UrlWithParsedQuery & {
              query: TGetResponseQuery,
            }

            if (req.method === 'GET' && urlData.pathname === '/list') {
              const list = getList(totalResults)

              res.end(JSON.stringify(list))

              return
            }

            if (req.method === 'GET' && urlData.pathname === '/get') {
              const buffer = getBuffer({ totalResults, pathsMap, query: urlData.query })

              if (buffer === null) {
                throw new Error(`Invalid get request: ${req.url}`)
              }

              res.setHeader('Content-Type', 'image/png')
              res.end(buffer, 'binary')

              return
            }

            if (req.method === 'POST' && req.url === '/save') {
              const keys = await unchunkJson<string[]>(req)

              await save({ totalResults, pathsMap, keys, type })

              res.end()
              server.close((error) => {
                if (error) {
                  saveReject(error)
                } else {
                  saveResolve()
                }
              })

              return
            }
          }

          res.end()
        } catch (error) {
          res.end()
          server.close()
          saveReject(error)
        }
      })
      .once('error', serverReject)
      .listen(SERVER_PORT, SERVER_HOST, () => {
        serverResolve(() => savePromise)
      })
  })
})
