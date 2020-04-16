import { TarFs } from '@x-ray/tar-fs'
import pAll from 'p-all'
// @ts-ignore
import imageminPngout from 'imagemin-pngout'
import { isDefined } from 'tsfn'
import { getTarFilePath } from '../utils/get-tar-file-path'
import { WRITE_RESULT_CONCURRENCY } from '../constants'
import { TTotalResults } from '../types'
import { TResultsType } from './types'

const optimizePng = imageminPngout({ strategy: 2 }) as (buf: Buffer) => Promise<Buffer>

export type TSaveOptions = {
  results: TTotalResults<TResultsType>,
  pathsMap: Map<string, string>,
  keys: string[],
  type: string,
  encoding: 'image' | 'text',
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
      }),
      { concurrency: WRITE_RESULT_CONCURRENCY }
    )

    await tarFs.save()
  }
}
