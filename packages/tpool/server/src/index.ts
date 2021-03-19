import http from 'http'
import https from 'https'
import { promisify } from 'util'
import { Worker } from 'worker_threads'
import type { TClientHandshake, TClientMessage, TServerHandshake, TServerMessage, TServerMessageError } from '@tpool/types'
import dleet from 'dleet'
import { jsonParse, jsonStringify } from 'typeon'
import { once } from 'wans'
import WS from 'ws'
import { resolve } from './resolve'
import type { TStartThreadPoolOptions, TWorkerMessage } from './types'

export const startThreadPool = async (options: TStartThreadPoolOptions) => {
  const workerPath = await resolve('./worker.mjs')

  const workers = await Promise.all(
    Array.from({ length: options.threadCount }, async () => {
      const worker = new Worker(workerPath)

      await once(worker, 'online')

      return worker
    })
  )

  console.log('threads:', options.threadCount)

  const url = new URL(options.url)
  const httpServer = url.protocol === 'wss:' ?
    https.createServer(options.tls ?? {}) :
    http.createServer()
  const wsServer = new WS.Server({ server: httpServer })

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
    const { fnString, callerDir, groupBy, groupType } = jsonParse<TClientHandshake>(optionsData)

    client.send(
      jsonStringify<TServerHandshake>({
        threadIds: workers.map((worker) => worker.threadId),
      })
    )

    client.on('message', async (data: string) => {
      let uid: string

      try {
        const wsMessage = jsonParse<TClientMessage>(data)

        uid = wsMessage.uid

        const worker = workers.find((worker) => worker.threadId === wsMessage.threadId)!

        worker.postMessage({
          arg: wsMessage.arg,
          fnString,
          callerDir,
          groupBy,
          groupType,
        })

        const { type, value } = await once<TWorkerMessage>(worker, 'message')

        client.send(
          jsonStringify<TServerMessage>({
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
