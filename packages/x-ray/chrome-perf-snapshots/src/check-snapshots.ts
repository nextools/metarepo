import path from 'path'
import { TarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import { diffArrays } from 'diff'
import prettyMs from 'pretty-ms'
import { getObjectEntries } from 'tsfn'
import { getPerfData } from 'perfa'
import { broResolve } from 'bro-resolve'
import { run } from '@rebox/web'
import { compareSnapshots } from './compare-snapshots'
import { getDataDimensions } from './get-data-dimensions'
import { runServer } from './run-server'
import {
  TSnapshotsResultData,
  TSnapshotsFileResultData,
  TSnapshotsResult,
  TSnapshotsFileResult,
  TFileResultLine,
  TPerfResult,
  TCheckChromePerfSnapshoptsOptions,
} from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)

export const checkChromePerfSnapshots = async (options: TCheckChromePerfSnapshoptsOptions) => {
  const result: TSnapshotsResult = {}
  const resultData: TSnapshotsResultData = {}
  const startTime = Date.now()
  let hasBeenChanged = false

  console.log('measuring reference app')

  const referenceData = await getPerfData({
    entryPointPath: require.resolve('./reference-app'),
    fontsDir: options.fontsDir,
  })

  for (const targetFile of options.targetFiles) {
    const relativePath = path.relative(process.cwd(), targetFile)

    console.log('measuring', relativePath)

    const targetResult: TSnapshotsFileResult = {
      deleted: {},
      new: {},
      diff: {},
    }
    const targetResultData: TSnapshotsFileResultData = {
      deleted: {},
      new: {},
      diff: {},
    }
    const snapshotsDir = path.join(path.dirname(targetFile), '__data__')
    const tar = await TarFs(path.join(snapshotsDir, 'chrome-perf-snapshots.tar.gz'))
    const id = 'id'
    const perfData = await getPerfData({
      entryPointPath: targetFile,
      fontsDir: options.fontsDir,
    })
    const relativePerfData = getObjectEntries(perfData).reduce((acc, [key, value]) => {
      acc[key] = value / referenceData[key]

      return acc
    }, {} as TPerfResult)

    if (tar.has(id)) {
      const { data: existingDataBuffer } = await tar.read(id) as TTarDataWithMeta

      const existingDataString = existingDataBuffer.toString()
      const existingPerfData = JSON.parse(existingDataString) as TPerfResult

      // diff
      if (!compareSnapshots(existingPerfData, relativePerfData)) {
        if (shouldBailout) {
          tar.close()
          throw `${relativePath}:diff`
        }

        const oldData = existingDataString.split('\n')
        const newData = JSON.stringify(relativePerfData, null, 2).split('\n')
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

        targetResult.diff[id] = {
          serializedElement: [],
          ...getDataDimensions(data),
        }
        targetResultData.diff[id] = data
        hasBeenChanged = true
      }
    // new
    } else {
      if (shouldBailout) {
        tar.close()
        throw `${relativePath}:new`
      }

      const data: TFileResultLine[] = JSON.stringify(relativePerfData, null, 2)
        .split('\n')
        .map((line) => ({
          value: line,
        }))

      targetResult.new[id] = {
        serializedElement: [],
        ...getDataDimensions(data),
      }
      targetResultData.new[id] = data
      hasBeenChanged = true
    }

    result[relativePath] = targetResult
    resultData[relativePath] = targetResultData

    tar.close()
  }

  console.log(`done in ${prettyMs(Date.now() - startTime)}`)

  if (hasBeenChanged) {
    const entryPointPath = await broResolve('@x-ray/ui')
    const htmlTemplatePath = path.join(path.dirname(entryPointPath), 'index.html')

    const closeReboxServer = await run({
      htmlTemplatePath,
      entryPointPath,
      isQuiet: true,
    })

    console.log('open http://localhost:3000/ to approve or discard changes')

    await runServer({
      result,
      resultData,
    })

    await closeReboxServer()
  }
}
