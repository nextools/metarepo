import https from 'https'
import http, { IncomingMessage, ServerResponse } from 'http'
import test from 'tape'
import { unchunkString } from 'unchunk'
import { mockRequest } from '../src'

const origFns = {
  https: {
    request: https.request,
    get: https.get,
  },
  http: {
    request: http.request,
    get: http.get,
  },
}
const protocols = ['https', 'http'] as const
const methods = ['request', 'get'] as const

for (const protocol of protocols) {
  for (const method of methods) {
    const testName = `${protocol}.${method}`

    test(`@mock/request: ${testName}()`, async (t) => {
      const fixturePath = `./fixtures/${protocol}`

      let unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be/`) {
          throw new Error('should not get here')
        }

        res.end(testName)
      })

      let imported = await import(fixturePath)

      let body = await new Promise((resolve, reject) => {
        imported[method](`${protocol}://youtu.be/`)
          .on('error', reject)
          .on('response', async (res: ServerResponse) => {
            const body = await unchunkString(res)

            resolve(body)
          })
          .end()
      })

      t.equal(
        body,
        testName,
        'url string'
      )

      unmockRequest()

      unmockRequest = mockRequest(require.resolve(fixturePath), (req, res) => {
        if (req.url !== `${protocol}://youtu.be/`) {
          throw new Error('should not get here')
        }

        res.end(testName)
      })

      imported = await import(fixturePath)

      body = await new Promise((resolve, reject) => {
        imported[method](`${protocol}://youtu.be/`)
          .on('error', reject)
          .on('response', async (res: ServerResponse) => {
            const body = await unchunkString(res)

            resolve(body)
          })
          .end()
      })

      t.equal(
        body,
        testName,
        'absolute path + url string'
      )

      unmockRequest()

      unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be/`) {
          throw new Error('should not get here')
        }

        res.end(testName)
      })

      imported = await import(fixturePath)

      body = await new Promise((resolve, reject) => {
        imported[method](`${protocol}://youtu.be/`, async (res: IncomingMessage) => {
          const data = await unchunkString(res)

          resolve(data)
        })
          .on('error', reject)
          .end()
      })

      t.equal(
        body,
        testName,
        'url string + callback'
      )

      unmockRequest()

      unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be/` || req.headers.test !== 'test') {
          throw new Error('should not get here')
        }

        res.end(`${protocol}.${method}`)
      })

      imported = await import(fixturePath)

      body = await new Promise((resolve, reject) => {
        imported[method](
          `${protocol}://youtu.be/`,
          {
            headers: {
              test: 'test',
            },
          },
          async (res: IncomingMessage) => {
            const data = await unchunkString(res)

            resolve(data)
          }
        )
          .on('error', reject)
          .end()
      })

      t.equal(
        body,
        testName,
        'url string + options + callback'
      )

      unmockRequest()

      unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be/`) {
          throw new Error('should not get here')
        }

        res.end(testName)

        t.pass('url object')
      })

      imported = await import(fixturePath)

      body = await new Promise((resolve, reject) => {
        imported[method](new URL(`${protocol}://youtu.be/`))
          .on('error', reject)
          .end(resolve)
      })

      unmockRequest()

      unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be/`) {
          throw new Error('should not get here')
        }

        res.end(`${protocol}.${method}`)
      })

      imported = await import(fixturePath)

      body = await new Promise((resolve, reject) => {
        imported[method](new URL(`${protocol}://youtu.be/`), async (res: IncomingMessage) => {
          const data = await unchunkString(res)

          resolve(data)
        })
          .on('error', reject)
          .end()
      })

      t.equal(
        body,
        testName,
        'url object + callback'
      )

      unmockRequest()

      unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be/`) {
          throw new Error('should not get here')
        }

        res.end(testName)

        t.pass('url object + options')
      })

      imported = await import(fixturePath)

      body = await new Promise((resolve, reject) => {
        imported[method](new URL(`${protocol}://youtu.be/`), {
          headers: {
            test: 'test',
          },
        })
          .on('error', reject)
          .end(resolve)
      })

      unmockRequest()

      unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be/` || req.headers.test !== 'test') {
          throw new Error('should not get here')
        }

        res.end(`${protocol}.${method}`)
      })

      imported = await import(fixturePath)

      body = await new Promise((resolve, reject) => {
        imported[method](
          new URL(`${protocol}://youtu.be/`),
          {
            headers: {
              test: 'test',
            },
          },
          async (res: IncomingMessage) => {
            const data = await unchunkString(res)

            resolve(data)
          }
        )
          .on('error', reject)
          .end()
      })

      t.equal(
        body,
        testName,
        'url object + options + callback'
      )

      unmockRequest()

      unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be/`) {
          throw new Error('should not get here')
        }

        t.pass('options')

        res.end(`${protocol}.${method}`)
      })

      imported = await import(fixturePath)

      await new Promise((resolve, reject) => {
        imported[method](
          {
            protocol: `${protocol}:`,
            hostname: 'youtu.be',
            path: '/',
          }
        )
          .on('error', reject)
          .end(resolve)
      })

      unmockRequest()

      unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be/`) {
          throw new Error('should not get here')
        }

        res.end(`${protocol}.${method}`)
      })

      imported = await import(fixturePath)

      body = await new Promise((resolve, reject) => {
        imported[method](
          {
            protocol: `${protocol}:`,
            hostname: 'youtu.be',
            path: '/',
          },
          async (res: IncomingMessage) => {
            const data = await unchunkString(res)

            resolve(data)
          }
        )
          .on('error', reject)
          .end()
      })

      t.equal(
        body,
        testName,
        'options (hostname, no port) + callback'
      )

      unmockRequest()

      unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be:8080/`) {
          throw new Error('should not get here')
        }

        res.end(`${protocol}.${method}`)
      })

      imported = await import(fixturePath)

      body = await new Promise((resolve, reject) => {
        imported[method](
          {
            protocol: `${protocol}:`,
            hostname: 'youtu.be',
            path: '/',
            port: '8080',
          },
          async (res: IncomingMessage) => {
            const data = await unchunkString(res)

            resolve(data)
          }
        )
          .on('error', reject)
          .end()
      })

      t.equal(
        body,
        testName,
        'options (hostname, port) + callback'
      )

      unmockRequest()

      unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be/`) {
          throw new Error('should not get here')
        }

        res.end(`${protocol}.${method}`)
      })

      imported = await import(fixturePath)

      body = await new Promise((resolve, reject) => {
        imported[method](
          {
            protocol: `${protocol}:`,
            host: 'youtu.be',
            path: '/',
          },
          async (res: IncomingMessage) => {
            const data = await unchunkString(res)

            resolve(data)
          }
        )
          .on('error', reject)
          .end()
      })

      t.equal(
        body,
        testName,
        'options (host) + callback'
      )

      unmockRequest()

      unmockRequest = mockRequest(fixturePath, (req, res) => {
        if (req.url !== `${protocol}://youtu.be/` || req.headers.test !== 'test') {
          throw new Error('should not get here')
        }

        res.end(`${protocol}.${method}`)
      })

      imported = await import(fixturePath)

      body = await new Promise((resolve, reject) => {
        imported[method](
          {
            protocol: `${protocol}:`,
            hostname: 'youtu.be',
            path: '/',
            headers: {
              test: 'test',
            },
          },
          async (res: IncomingMessage) => {
            const data = await unchunkString(res)

            resolve(data)
          }
        )
          .on('error', reject)
          .end()
      })

      t.equal(
        body,
        testName,
        'options (headers) + callback'
      )

      unmockRequest()

      imported = await import(fixturePath)

      t.equal(
        imported[method],
        origFns[protocol][method],
        'should unmock'
      )
    })
  }
}
