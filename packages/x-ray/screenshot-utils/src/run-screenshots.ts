import path from 'path'
import { TAnyObject } from 'tsfn'
import { makeWorker } from '@x-ray/worker-utils'
import { TScreenshotsFileResultData, TScreenshotsItemResult, TScreenshotsResultData, TRunScreesnotsResult, TScreenshotsResult, TScreenshotsFileResult } from './types'

const dprSize = (dpr: number) => (size: number): number => Math.round(size / dpr * 100) / 100

export const runScreenshots = (childFile: string, targetFiles: string[], consurrency: number, options: TAnyObject) => new Promise<TRunScreesnotsResult>((resolve, reject) => {
  const workersCount = Math.min(targetFiles.length, consurrency)
  const dpr = dprSize(options.dpr as number)
  const result: TScreenshotsResult = {}
  const resultData: TScreenshotsResultData = {}
  let targetFileIndex = 0
  let doneWorkersCount = 0
  let hasBeenChanged = false
  const startTime = Date.now()
  let okCount = 0
  let newCount = 0
  let deletedCount = 0
  let diffCount = 0

  const workers = Array(workersCount)
    .fill(null)
    .map(() => {
      let targetResult: TScreenshotsFileResult = {
        old: {},
        new: {},
      }
      let targetResultData: TScreenshotsFileResultData = {
        old: {},
        new: {},
      }
      const worker = makeWorker(childFile, options)

      worker.on('message', async (action: TScreenshotsItemResult) => {
        switch (action.type) {
          case 'OK': {
            okCount++

            break
          }
          case 'DIFF': {
            targetResult.old[action.id] = {
              serializedElement: action.serializedElement,
              width: dpr(action.old.width),
              height: dpr(action.old.height),
            }
            targetResult.new[action.id] = {
              serializedElement: action.serializedElement,
              width: dpr(action.new.width),
              height: dpr(action.new.height),
            }
            targetResultData.old[action.id] = Buffer.from(action.old.data)
            targetResultData.new[action.id] = Buffer.from(action.new.data)

            hasBeenChanged = true

            diffCount++

            break
          }
          case 'NEW': {
            targetResult.new[action.id] = {
              serializedElement: action.serializedElement,
              width: dpr(action.width),
              height: dpr(action.height),
            }
            targetResultData.new[action.id] = Buffer.from(action.data)

            hasBeenChanged = true

            newCount++

            break
          }
          case 'DELETED': {
            targetResult.old[action.id] = {
              serializedElement: action.serializedElement,
              width: dpr(action.width),
              height: dpr(action.height),
            }
            targetResultData.old[action.id] = Buffer.from(action.data)

            hasBeenChanged = true

            deletedCount++

            break
          }
          case 'BAILOUT': {
            await Promise.all(workers.map((worker) => worker.terminate()))

            reject(null)

            break
          }
          case 'DONE': {
            const relativePath = path.relative(process.cwd(), action.path)
            result[relativePath] = targetResult
            resultData[relativePath] = targetResultData

            targetResult = {
              old: {},
              new: {},
            }
            targetResultData = {
              old: {},
              new: {},
            }

            if (targetFileIndex < targetFiles.length) {
              worker.postMessage({
                type: 'FILE',
                path: targetFiles[targetFileIndex++],
              })

              break
            }

            worker.postMessage({ type: 'DONE' })

            doneWorkersCount++

            if (doneWorkersCount === workers.length) {
              console.log(`ok: ${okCount}`)
              console.log(`new: ${newCount}`)
              console.log(`deleted: ${deletedCount}`)
              console.log(`diff: ${diffCount}`)
              console.log(`done in ${Date.now() - startTime}ms`)

              resolve({
                result,
                resultData,
                hasBeenChanged,
              })
            }

            break
          }
          case 'ERROR': {
            reject(action.data)
          }
        }
      })

      worker.postMessage({
        type: 'FILE',
        path: targetFiles[targetFileIndex++],
      })

      return worker
    })
})
