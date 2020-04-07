import http from 'http'
import { Worker } from 'worker_threads'
import { runIosApp } from '@rebox/ios'
import { rsolve } from 'rsolve'
import { unchunkBuffer } from 'unchunk'
import { TResults, TCheckResults } from '../types'
import { prepareFiles } from './prepare-files'
import { TMessage } from './types'

const SERVER_HOST = 'localhost'
const SERVER_PORT = 3003
const WORKER_PATH = require.resolve('./worker-setup')

export const getResults = async (files: string[], fontsDir?: string) => {
  const entryPointPath = await rsolve('@x-ray/native-screenshots-app', 'react-native')

  await prepareFiles(entryPointPath, files)

  // const killAll = await runIosApp({
  await runIosApp({
    appName: 'X-Ray',
    appId: 'org.nextools.x-ray',
    iPhoneVersion: 8,
    iOSVersion: '13.2',
    entryPointPath,
    fontsDir,
    dependencyNames: [
      'react-native-svg',
      'react-native-view-shot',
    ],
    isHeadless: false,
    logMessage: console.log,
  })

  const workers = Array.from({ length: 4 }, () => new Worker(WORKER_PATH))
  const busyWorkerIds = new Set<number>()
  const results: TResults = new Map()
  // const status = {
  //   ok: 0,
  //   new: 0,
  //   diff: 0,
  //   deleted: 0,
  // }

  Buffer.poolSize = 0

  const server = http.createServer(async (req, res) => {
    if (req.url === '/upload') {
      const body = await unchunkBuffer(req)
      const worker = workers.find(({ threadId }) => !busyWorkerIds.has(threadId))!

      busyWorkerIds.add(worker.threadId)

      await new Promise<void>((resolve, reject) => {
        worker
          .on('error', reject)
          .on('message', (message: TMessage) => {
            worker.removeAllListeners('error')
            worker.removeAllListeners('message')

            busyWorkerIds.delete(worker.threadId)

            if (message.type === 'DONE') {
              if (!results.has(message.path)) {
                const checkResultsMap: TCheckResults<Uint8Array> = new Map()

                results.set(message.path, checkResultsMap)
              }

              results.get(message.path)!.set(message.id, message.value)

              resolve()
              /* istanbul ignore else */
            } else if (message.type === 'ERROR') {
              reject(message.value)
            }
          })
          .postMessage(body, [body.buffer])
      })
    }

    res.end()
  })

  server.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log('SERVER')
  })
}
