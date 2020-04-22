import { access } from 'pifs'
import { TarFs, TTarFs } from '@x-ray/tar-fs'
import { TJsonValue } from 'typeon'
import { map, toMapAsync } from 'iterama'
import { piAll } from 'piall'
import serialize from '@x-ray/serialize-react-tree'
import { getTarFilePath, TExample, TExampleResult } from '@x-ray/core'
import { hasSnapshotDiff } from './has-snapshot-diff'
import { TWorkerResultInternal } from './types'
import { getSnapshotDimensions } from './get-snapshot-dimensions'
import { SNAPSHOTS_PER_WORKER_COUNT, REQUIRE_HOOK_PATH } from './constants'

export const check = () => async (filePath: string): Promise<TWorkerResultInternal<string>> => {
  await import(REQUIRE_HOOK_PATH)

  const { name, examples } = await import(filePath) as { name: string, examples: Iterable<TExample> }
  const status = {
    ok: 0,
    new: 0,
    diff: 0,
    deleted: 0,
  }

  const tarFilePath = getTarFilePath({
    examplesFilePath: filePath,
    examplesName: name,
    pluginName: 'react-native-snapshots',
  })

  let tarFs = null as null | TTarFs

  try {
    await access(tarFilePath)

    tarFs = await TarFs(tarFilePath)
  } catch {}

  const asyncIterable = piAll(
    map((example: TExample) => async (): Promise<[string, TExampleResult<string>]> => {
      const newSnapshot = serialize(example.element)

      // NEW
      if (tarFs === null || !tarFs.has(example.id)) {
        const { width, height } = getSnapshotDimensions(newSnapshot)

        status.new++

        return [example.id, {
          type: 'NEW',
          meta: example.meta,
          data: newSnapshot,
          width,
          height,
        }]
      }

      const origSnapshotBuffer = await tarFs.read(example.id) as Buffer
      const origSnapshot = origSnapshotBuffer.toString('utf8')

      // DIFF
      if (hasSnapshotDiff(newSnapshot, origSnapshot)) {
        const { width: origWidth, height: origHeight } = getSnapshotDimensions(origSnapshot)
        const { width, height } = getSnapshotDimensions(newSnapshot)

        status.diff++

        return [example.id, {
          type: 'DIFF',
          data: newSnapshot,
          width,
          height,
          origData: origSnapshot,
          origWidth,
          origHeight,
          meta: example.meta,
        }]
      }

      // OK
      status.ok++

      return [example.id, {
        type: 'OK',
      }]
    })(examples),
    SNAPSHOTS_PER_WORKER_COUNT
  )

  const fileResults = await toMapAsync(asyncIterable)

  // DELETED
  if (tarFs !== null) {
    for (const id of tarFs.list()) {
      if (id.endsWith('-meta')) {
        continue
      }

      if (!fileResults.has(id)) {
        const deletedSnapshotBuffer = await tarFs.read(id) as Buffer
        const deletedSnapshot = deletedSnapshotBuffer.toString('utf8')
        const { width, height } = getSnapshotDimensions(deletedSnapshot)
        const metaId = `${id}-meta`
        let meta

        if (tarFs.has(metaId)) {
          const metaBuffer = await tarFs.read(id) as Buffer

          meta = JSON.parse(metaBuffer.toString('utf8')) as TJsonValue
        }

        fileResults.set(id, {
          type: 'DELETED',
          data: deletedSnapshot,
          meta,
          width,
          height,
        })

        status.deleted++
      }
    }

    await tarFs.close()
  }

  return {
    value: [filePath, { name, results: fileResults, status }],
  }
}
