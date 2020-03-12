import http from 'http'
import url from 'url'
import listFixture from './fixtures/list.json'
import getFixture from './fixtures/get.json'

export const runXRayServer = (): Promise<void> => new Promise((resolve, reject) => {
  http
    .createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

      if (req.method === 'GET') {
        if (req.url === '/list') {
          res.end(JSON.stringify(listFixture))

          return
        }

        const urlData = url.parse(req.url!, true)

        if (urlData.pathname === '/get') {
          res.end(JSON.stringify(getFixture))
        }
      }

      if (req.method === 'POST') {
        if (req.url === '/save') {
          let body = ''

          req
            .on('data', (chunk: Buffer) => {
              body += chunk.toString()
            })
            .on('error', console.error)
            .on('end', () => {
              console.log('SAVE', JSON.parse(body))
            })
        }
      }
    })
    .on('error', reject)
    .on('listening', resolve)
    .listen(3001, 'localhost')
})
