import path from 'path'
import { TarFs } from '@x-ray/tar-fs'
import pAll from 'p-all'
// @ts-ignore
import imageminPngout from 'imagemin-pngout'
import { map } from 'iterama'
import { isDefined } from 'tsfn'
import makeDir from 'make-dir'
import { getTarFilePath } from '../get-tar-file-path'
import { WRITE_RESULT_CONCURRENCY } from '../constants'
import { TTotalResults, TResultsType, TEncoding } from '../types'

const optimizePng = imageminPngout({ strategy: 2 }) as (buf: Buffer) => Promise<Buffer>

export type TSaveOptions = {
  results: TTotalResults<TResultsType>,
  pathsMap: Map<string, string>,
  keys: string[],
  pluginName: string,
  encoding: TEncoding,
}

export const save = async (options: TSaveOptions): Promise<void> => {
  const saveMap = options.keys.reduce((acc, key) => {
    const [name, id] = key.split('::')
    const filePath = options.pathsMap.get(name)!

    if (!acc.has(filePath)) {
      acc.set(filePath, { name, ids: new Set() })
    }

    acc.get(filePath)!.ids.add(id)

    return acc
  }, new Map<string, { name: string, ids: Set<string> }>())

  for (const [filePath, { name, ids }] of saveMap) {
    const tarFilePath = getTarFilePath({
      examplesFilePath: filePath,
      examplesName: name,
      pluginName: options.pluginName,
    })
    const tarFileDir = path.dirname(tarFilePath)

    await makeDir(tarFileDir)

    const tarFs = await TarFs(tarFilePath)

    await pAll(
      map((id: string) => async () => {
        const result = options.results.get(filePath)!.results.get(id)!

        switch (result.type) {
          case 'NEW': {
            let data: Buffer

            if (options.encoding === 'image') {
              data = await optimizePng(Buffer.from(result.data))
            } else {
              data = Buffer.from(result.data)
            }

            tarFs.write(id, data)

            if (isDefined(result.meta)) {
              tarFs.write(`${id}-meta`, Buffer.from(JSON.stringify(result.meta)))
            }

            break
          }
          case 'DIFF': {
            let data: Buffer

            if (options.encoding === 'image') {
              data = await optimizePng(Buffer.from(result.data))
            } else {
              data = Buffer.from(result.data)
            }

            tarFs.write(id, data)

            if (isDefined(result.meta)) {
              tarFs.write(`${id}-meta`, Buffer.from(JSON.stringify(result.meta)))
            }

            break
          }
          case 'DELETED': {
            tarFs.delete(id)
            tarFs.delete(`${id}-meta`)
          }
        }
      })(ids),
      { concurrency: WRITE_RESULT_CONCURRENCY }
    )

    await tarFs.save()
  }
}
