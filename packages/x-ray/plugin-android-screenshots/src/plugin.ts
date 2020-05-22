import http from 'http'
import { Worker } from 'worker_threads'
import url, { UrlWithParsedQuery } from 'url'
import { runAndroidApp } from '@rebox/android'
import { rsolve } from 'rsolve'
import { unchunkBuffer } from 'unchunk'
import { TTotalResults, TPlugin } from '@x-ray/core'
import { prepareMeta } from './prepare-meta'
import { TMessage } from './types'
import { WORKER_PATH, SERVER_PORT, SERVER_HOST, MAX_THREAD_COUNT } from './constants'

export type TAndroidScreenshotsOptions = {
  fontsDir?: string,
  shouldBailout?: boolean,
}

export const androidScreenshots = (options?: TAndroidScreenshotsOptions): TPlugin<Uint8Array> => ({
  name: 'android-screenshots',
  encoding: 'image',
  appEntryPointPath: require.resolve('./App.tsx'),
  getResults: async (files) => {
    const opts = {
      shouldBailout: false,
      ...options,
    }
    const entryPointPath = await rsolve('@x-ray/native-screenshots-app', 'react-native')
    const threadCount = Math.min(MAX_THREAD_COUNT, files.length)

    await prepareMeta(entryPointPath, files, threadCount)

    const closeAndroidApp = await runAndroidApp({
      appName: 'X-Ray',
      appId: 'org.nextools.xray',
      entryPointPath,
      fontsDir: options?.fontsDir,
      dependencyNames: [
        'react-native-svg',
        'react-native-view-shot',
      ],
      portsToForward: [3002],
      isHeadless: true,
    })

    const workers = Array.from({ length: threadCount }, () => new Worker(
      WORKER_PATH,
      {
        workerData: {
          dpr: 3,
          shouldBailout: opts.shouldBailout,
        },
      }
    ))
    const totalResults: TTotalResults<Uint8Array> = new Map()
    const busyWorkerIds = new Set<number>()
    const pathWorkers = new Map<string, number>()

    Buffer.poolSize = 0

    try {
      await new Promise<void>((serverResolve, serverReject) => {
        const server = http.createServer(async (req, res) => {
          try {
            const urlData = url.parse(req.url!, true) as UrlWithParsedQuery & {
              query: {
                path: string,
              },
            }

            if (urlData.pathname === '/upload') {
              const path = urlData.query.path as string

              const body = await unchunkBuffer(req)
              let worker: Worker

              // no worker for path, assign new
              if (!pathWorkers.has(path)) {
                worker = workers.find(({ threadId }) => !busyWorkerIds.has(threadId))!

                busyWorkerIds.add(worker.threadId)
                pathWorkers.set(path, worker.threadId)
                // reuse worker
              } else {
                const pathThreadId = pathWorkers.get(path)!

                worker = workers.find(({ threadId }) => threadId === pathThreadId)!
                // release worker
                worker.removeAllListeners('error')
                worker.removeAllListeners('message')
              }

              await new Promise<void>((reqResolve, reqReject) => {
                worker
                  .once('error', reqReject)
                  .on('message', (message: TMessage) => {
                    switch (message.type) {
                      case 'EXAMPLE': {
                        if (!message.isDone) {
                          reqResolve()

                          break
                        }

                        busyWorkerIds.delete(pathWorkers.get(path)!)
                        pathWorkers.delete(path)

                        const [filePath, result] = message.value

                        totalResults.set(filePath, result)

                        console.log(result.name)

                        reqResolve()

                        break
                      }
                      case 'ERROR': {
                        reqReject(message.value)
                      }
                    }
                  })
                  .postMessage({ value: body }, [body.buffer])
              })
            } else if (urlData.pathname === '/done') {
              server.close(() => {
                serverResolve()
              })
            }
          } catch (error) {
            serverReject(error)
          }

          res.end()
        })

        server.once('error', serverReject)
        server.listen(SERVER_PORT, SERVER_HOST)
      })
    } finally {
      await Promise.all(
        workers.map((worker) => new Promise((resolve) => {
          worker
            .on('exit', resolve)
            .postMessage({ done: true })
        }))
      )

      closeAndroidApp()
    }

    return totalResults
  },
})
