import { unlinkSync } from 'fs'
import http from 'http'
import type { RequestListener, RequestOptions } from 'http'
import path from 'path'
import { mockRequire } from '@mock/require'
import getCallerFile from 'get-caller-file'
import onExit from 'signal-exit'
import tempy from 'tempy'

export const mockRequest = (file: string, callback: RequestListener): () => void => {
  const socketPath = tempy.file({ extension: 'sock' })

  onExit((code) => {
    if (code === null || code > 0) {
      try {
        unlinkSync(socketPath)
      } catch {}
    }
  })

  const server = http.createServer((req, res) => {
    const { $mockurl$, ...headers } = req.headers

    req.url = $mockurl$ as string
    req.headers = headers

    callback(req, res)
  })

  server.listen(socketPath)

  const mockReq = (arg1: any, arg2: any, arg3?: any) => {
    let reqUrl = ''
    let options = {} as RequestOptions
    let callback

    if (Object.prototype.toString.call(arg1) === '[object URL]') {
      const url = arg1 as URL

      options.hostname = url.hostname
      options.host = url.host
      options.port = url.port
      options.path = `${url.pathname}${url.search}${url.hash}`
      reqUrl = url.toString()
    } else if (typeof arg1 === 'string') {
      const url = new URL(arg1)

      options.hostname = url.hostname
      options.host = url.host
      options.port = url.port
      options.path = `${url.pathname}${url.search}${url.hash}`

      reqUrl = arg1
    } else {
      options = arg1 as RequestOptions

      const host = options.hostname || options.host
      const port = options.port ? `:${options.port}` : ''

      reqUrl = `${options.protocol}//${host}${port}${options.path}`
    }

    if (Object.prototype.toString.call(arg2) === '[object Object]') {
      options = {
        ...options,
        ...arg2 as RequestOptions,
      }
    } else if (typeof arg2 === 'function') {
      callback = arg2
    }

    if (typeof arg3 === 'function') {
      callback = arg3
    }

    options = {
      ...options,
      headers: {
        ...options.headers,
        $mockurl$: reqUrl,
      },
      protocol: 'http:',
      socketPath,
    }

    return http.request(options, callback)
  }

  let fullFilePath = file

  if (!path.isAbsolute(file)) {
    const callerDir = path.dirname(getCallerFile())
    const targetPath = path.resolve(callerDir, file)

    fullFilePath = require.resolve(targetPath)
  }

  const unmockImport = mockRequire(fullFilePath, {
    https: {
      get: mockReq,
      request: mockReq,
    },
    http: {
      get: mockReq,
      request: mockReq,
    },
  })

  return () => {
    server.close()
    unmockImport()
  }
}
