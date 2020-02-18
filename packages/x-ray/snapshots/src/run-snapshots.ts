import path from 'path'
import { TOptions } from '@x-ray/common-utils'
import { makeWorker } from '@x-ray/worker-utils'
import { diffArrays } from 'diff'
import prettyMs from 'pretty-ms'
import { TRunSnapshotsResult, TSnapshotsResultData, TSnapshotsFileResultData, TSnapshotsItemResult, TSnapshotsResult, TSnapshotsFileResult, TFileResultLine } from './types'

const getDataSize = (lines: TFileResultLine[]) => {
  let maxWidth = 0

  for (const line of lines) {
    if (line.value.length > maxWidth) {
      maxWidth = line.value.length
    }
  }

  return {
    width: maxWidth,
    height: lines.length,
  }
}

export const runSnapshots = (childFile: string, targetFiles: string[], consurrency: number, options: TOptions) => new Promise<TRunSnapshotsResult>((resolve, reject) => {
  const workersCount = Math.min(targetFiles.length, consurrency)
  const result: TSnapshotsResult = {}
  const resultData: TSnapshotsResultData = {}
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
      let targetResult: TSnapshotsFileResult = {
        deleted: {},
        new: {},
        diff: {},
      }
      let targetResultData: TSnapshotsFileResultData = {
        deleted: {},
        new: {},
        diff: {},
      }
      const worker = makeWorker(childFile, options)

      worker.on('message', async (action: TSnapshotsItemResult) => {
        switch (action.type) {
          case 'INIT': {
            worker.send({
              type: 'FILE',
              path: targetFiles[targetFileIndex++],
            })

            break
          }
          case 'OK': {
            okCount++

            break
          }
          case 'DIFF': {
            const oldData = Buffer.from(action.oldData)
              .toString()
              .split('\n')
            const newData = Buffer.from(action.newData)
              .toString()
              .split('\n')

            const diffData = diffArrays(oldData, newData)

            const data = diffData.reduce((result, chunk) => {
              return result.concat(
                chunk.value.map((line) => {
                  if (chunk.added) {
                    return {
                      value: line,
                      type: 'added',
                    }
                  }

                  if (chunk.removed) {
                    return {
                      value: line,
                      type: 'removed',
                    }
                  }

                  return {
                    value: line,
                  }
                })
              )
            }, [] as TFileResultLine[])

            targetResult.diff[action.id] = {
              serializedElement: action.serializedElement,
              ...getDataSize(data),
            }
            targetResultData.diff[action.id] = data

            hasBeenChanged = true

            diffCount++

            break
          }
          case 'NEW': {
            const data: TFileResultLine[] = Buffer.from(action.data)
              .toString()
              .split('\n')
              .map((line) => ({
                value: line,
              }))

            targetResult.new[action.id] = {
              serializedElement: action.serializedElement,
              ...getDataSize(data),
            }
            targetResultData.new[action.id] = data

            hasBeenChanged = true

            newCount++

            break
          }
          case 'DELETED': {
            const data = Buffer.from(action.data)
              .toString()
              .split('\n')
              .map((line) => ({
                value: line,
              }))

            targetResult.deleted[action.id] = {
              serializedElement: action.serializedElement,
              ...getDataSize(data),
            }
            targetResultData.deleted[action.id] = data

            hasBeenChanged = true

            deletedCount++

            break
          }
          case 'BAILOUT': {
            await Promise.all(workers.map((worker) => worker.kill()))

            reject(`${path.relative(process.cwd(), action.path)}:${action.id}:${action.reason}`)

            break
          }
          case 'DONE': {
            const relativePath = path.relative(process.cwd(), action.path)

            result[relativePath] = targetResult
            resultData[relativePath] = targetResultData

            console.log(relativePath)

            targetResult = {
              deleted: {},
              new: {},
              diff: {},
            }
            targetResultData = {
              deleted: {},
              new: {},
              diff: {},
            }

            if (targetFileIndex < targetFiles.length) {
              worker.send({
                type: 'FILE',
                path: targetFiles[targetFileIndex++],
              })

              break
            }

            worker.send({ type: 'DONE' })

            doneWorkersCount++

            if (doneWorkersCount === workers.length) {
              console.log(`ok: ${okCount}`)
              console.log(`new: ${newCount}`)
              console.log(`deleted: ${deletedCount}`)
              console.log(`diff: ${diffCount}`)
              console.log(`done in ${prettyMs(Date.now() - startTime)}`)

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

      return worker
    })
})
