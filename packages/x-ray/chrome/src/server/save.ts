import { TarFs } from '@x-ray/tar-fs'
import pAll from 'p-all'
// @ts-ignore
import imageminPngout from 'imagemin-pngout'
import { isDefined } from 'tsfn'
import { getTarFilePath } from '../get-tar-file-path'
import { TResults } from '../types'
import { WRITE_RESULT_CONCURRENCY } from '../constants'

const optimizePng = imageminPngout({ strategy: 2 })

export const save = async (results: TResults, pathMap: Map<string, string>, keys: string[]): Promise<void> => {
  const saveMap = keys.reduce((acc, key) => {
    const [shortPath, id] = key.split(':')
    const longPath = pathMap.get(shortPath)!

    if (!Reflect.has(acc, longPath)) {
      acc[longPath] = []
    }

    acc[longPath].push(id)

    return acc
  }, {} as { [path: string]: string[] })

  for (const [filePath, ids] of Object.entries(saveMap)) {
    const tarFs = await TarFs(getTarFilePath(filePath))

    await pAll(
      ids.map((id) => async () => {
        const result = results.get(filePath)!.get(id)!

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
