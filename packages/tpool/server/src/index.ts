import http from 'http'
import https from 'https'
import { promisify } from 'util'
import { Worker } from 'worker_threads'
import type { TMessageFromServer, THandshakeFromClient, TMessageFromClient, THandshakeFromServer, TServerMessageError } from '@tpool/types'
import dleet from 'dleet'
import type { TJsonValue } from 'typeon'
import { jsonParse, jsonStringify } from 'typeon'
import { once } from 'wans'
import WS from 'ws'
import { resolve } from './resolve'
import type { TStartThreadPoolOptions, TMessageFromWorker } from './types'

export const startThreadPool = async (options: TStartThreadPoolOptions) => {
  const workerPath = await resolve('./worker-wrapper.mjs')

  const workers = await Promise.all(
    Array.from({ length: options.threadCount }, async () => {
      const worker = new Worker(workerPath, {
        trackUnmanagedFds: true,
      })

      await once(worker, 'online')

      return worker
    })
  )

  console.log('threads:', options.threadCount)

  const url = new URL(options.url)
  const httpServer = url.protocol === 'wss:' ?
    https.createServer(options.tls ?? {}) :
    http.createServer()
  const wsServer = new WS.Server({
    server: httpServer,
    // perMessageDeflate: true,
  })

  switch (url.protocol) {
    case 'ws+unix:': {
      await dleet(url.pathname)

      httpServer.listen(url.pathname)

      break
    }
    case 'ws:':
    case 'wss:': {
      httpServer.listen({
        hostname: url.hostname,
        port: Number(url.port),
      })

      break
    }
    default: {
      throw new Error('Supported protocols: ws+unix:, ws:, wss:')
    }
  }

  await once(wsServer, 'listening')

  console.log('server:', options.url)

  wsServer.on('connection', async (client) => {
    const optionsData = await once<string>(client, 'message')
    const { taskString, callerDir, arg, groupBy, groupType } = jsonParse<THandshakeFromClient>(optionsData)

    client.send(
      jsonStringify<THandshakeFromServer>({
        threadIds: workers.map((worker) => worker.threadId),
      })
    )

    client.on('message', async (data: string) => {
      let uid: string

      try {
        const wsMessage = jsonParse<TMessageFromClient>(data)

        uid = wsMessage.uid

        const worker = workers.find((worker) => worker.threadId === wsMessage.threadId)!

        worker.postMessage({
          group: wsMessage.group,
          arg,
          taskString,
          callerDir,
          groupBy,
          groupType,
        })

        const { type, value } = await once<TMessageFromWorker>(worker, 'message')

        client.send(
          jsonStringify<TMessageFromServer<TJsonValue>>({
            uid,
            type,
            value,
          })
        )
      } catch (err) {
        client.send(
          jsonStringify<TServerMessageError>({
            // TODO: handle error properly
            uid: uid!,
            type: 'ERROR',
            value: err.stack ?? err,
          })
        )
      }
    })
  })

  return async () => {
    await promisify(wsServer.close).bind(wsServer)()
    await promisify(httpServer.close).bind(httpServer)()

    await Promise.all(
      workers.map((worker) => worker.terminate())
    )
  }
}
