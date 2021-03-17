import http from 'http'
import { promisify } from 'util'
import { Worker } from 'worker_threads'
import dleet from 'dleet'
import { jsonParse, jsonStringify } from 'typeon'
import { once } from 'wans'
import WS from 'ws'
import { resolve } from './resolve'
import type { TStartThreadPoolOptions, TWorkerMessage, TWsMessage } from './types'

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

  if (typeof options.address === 'string' && options.address.startsWith('/')) {
    await dleet(options.address)
  }

  const httpServer = http.createServer()
  const wsServer = new WS.Server({ server: httpServer })

  httpServer.listen(options.address)

  await once(wsServer, 'listening')

  console.log('server:', options.address)

  wsServer.on('connection', (client) => {
    client.send(
      jsonStringify({
        threadIds: workers.map((worker) => worker.threadId),
      })
    )

    client.on('message', async (data: string) => {
      let uid: string

      try {
        const wsMessage = jsonParse<TWsMessage>(data)

        uid = wsMessage.uid

        const worker = workers.find((worker) => worker.threadId === wsMessage.threadId)!

        worker.postMessage(wsMessage.value)

        const { type, value } = await once<TWorkerMessage>(worker, 'message')

        client.send(
          jsonStringify({ uid, type, value })
        )
      } catch (err) {
        client.send(
          jsonStringify({
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
