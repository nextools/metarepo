import { TarFs } from '@x-ray/tar-fs'
import pAll from 'p-all'
// @ts-ignore
import imageminPngout from 'imagemin-pngout'
import { isDefined } from 'tsfn'
import { getTarFilePath } from '../utils/get-tar-file-path'
import { WRITE_RESULT_CONCURRENCY } from '../constants'
import { TTotalResults } from '../types'

const optimizePng = imageminPngout({ strategy: 2 })

export type TSaveOptions = {
  totalResults: TTotalResults,
  pathsMap: Map<string, string>,
  keys: string[],
  type: string,
}

export const save = async (options: TSaveOptions): Promise<void> => {
  const saveMap = options.keys.reduce((acc, key) => {
    const [name, id] = key.split('::')
    const filePath = options.pathsMap.get(name)!

    if (!Reflect.has(acc, filePath)) {
      acc[filePath] = []
    }

    acc[filePath].push(id)

    return acc
  }, {} as { [path: string]: string[] })

  for (const [filePath, ids] of Object.entries(saveMap)) {
    const tarFs = await TarFs(getTarFilePath(filePath, options.type))

    await pAll(
      ids.map((id) => async () => {
        const result = options.totalResults.get(filePath)!.results.get(id)!

        switch (result.type) {
          case 'NEW': {
            const data = await optimizePng(Buffer.from(result.data))

            tarFs.write(id, data)

            if (isDefined(result.meta)) {
              tarFs.write(`${id}-meta`, Buffer.from(JSON.stringify(result.meta)))
            }

            break
          }
          case 'DIFF': {
            const data = await optimizePng(Buffer.from(result.newData))

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
      }),
      { concurrency: WRITE_RESULT_CONCURRENCY }
    )

    await tarFs.save()
  }
}
