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

  await dleet(options.socketPath)

  const busyWorkers = new Set<number>()
  const workers = await Promise.all(
    Array.from({ length: options.threadCount }, async () => {
      const worker = new Worker(workerPath, {
        workerData: {
          foo: true,
        },
      })

      await once(worker, 'online')

      return worker
    })
  )

  console.log('threads:', workers.length)

  const httpServer = http.createServer()
  const wsServer = new WS.Server({ server: httpServer })

  httpServer.listen(options.socketPath)

  await once(wsServer, 'listening')

  console.log('server:', options.socketPath)

  wsServer.on('connection', (ws) => {
    ws.on('message', async (data: string) => {
      const worker = workers.find(({ threadId }) => !busyWorkers.has(threadId))!

      busyWorkers.add(worker.threadId)

      const wsMessage = jsonParse<TWsMessage>(data)

      worker.postMessage(wsMessage.value)

      const { type, value } = await once<TWorkerMessage>(worker, 'message')

      busyWorkers.delete(worker.threadId)

      ws.send(
        jsonStringify({
          id: wsMessage.id,
          type,
          value,
        })
      )
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
