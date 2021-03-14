import http from 'http'
import { Worker } from 'worker_threads'
import dleet from 'dleet'
import { isDefined } from 'tsfn'
import { once } from 'wans'
import WS from 'ws'
import { resolve } from './resolve'

export type TStartThreadPoolOptions = {
  threadCount: number,
  socketPath: string,
}

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

      const { message, id } = JSON.parse(data)

      worker.postMessage(message)

      const { type, value } = await once(worker, 'message')

      busyWorkers.delete(worker.threadId)

      ws.send(
        JSON.stringify({ id, type, value })
      )
    })
  })

  return async () => {
    await new Promise<void>((resolve, reject) => {
      wsServer.close((err) => {
        if (isDefined(err)) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    await new Promise<void>((resolve, reject) => {
      httpServer.close((err) => {
        if (isDefined(err)) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    await Promise.all(
      workers.map((worker) => worker.terminate())
    )
  }
}
