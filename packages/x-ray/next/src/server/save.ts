import { TarFs } from '@x-ray/tar-fs'
import pAll from 'p-all'
// @ts-ignore
import imageminPngout from 'imagemin-pngout'
import { isDefined } from 'tsfn'
import { getTarFilePath } from '../utils/get-tar-file-path'
import { WRITE_RESULT_CONCURRENCY } from '../constants'
import { TResults } from '../types'

const optimizePng = imageminPngout({ strategy: 2 })

export const save = async (results: TResults, keys: string[]): Promise<void> => {
  const saveMap = keys.reduce((acc, key) => {
    const [filePath, name, id] = key.split('::')
    const fileId = `${filePath}::${name}`

    if (!Reflect.has(acc, fileId)) {
      acc[fileId] = []
    }

    acc[fileId].push(id)

    return acc
  }, {} as { [path: string]: string[] })

  for (const [fileId, ids] of Object.entries(saveMap)) {
    const [filePath] = fileId.split('::')
    // TODO: extract `chrome` type
    const tarFs = await TarFs(getTarFilePath(filePath, 'chrome'))

    await pAll(
      ids.map((id) => async () => {
        const result = results.get(fileId)!.get(id)!

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
