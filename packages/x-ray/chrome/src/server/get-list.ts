import path from 'path'
import pAll from 'p-all'
import pkgDir from 'pkg-dir'
import { isUndefined } from 'tsfn'
import { TResults, TItems } from '../types'
import { SHORT_PATH_CONCURRENCY } from '../constants'

export type TListResponse = {
  type: 'image',
  files: string[],
  items: TItems,
}

export const getList = async (results: TResults, pathMap: Map<string, string>): Promise<TListResponse> => {
  const shortPaths = await pAll<string>(
    Object.keys(results).map((longPath) => async () => {
      // const packageDir = await pkgDir(path.dirname(longPath))

      // if (isUndefined(packageDir)) {
      //   throw new Error(`Cannot find package dir for "${longPath}"`)
      // }

      // const shortPath = path.relative(path.resolve('packages/'), packageDir)
      const shortPath = path.basename(longPath, '.tsx')

      pathMap.set(shortPath, longPath)
      pathMap.set(longPath, shortPath)

      return shortPath
    }),
    { concurrency: SHORT_PATH_CONCURRENCY }
  )

  return {
    type: 'image',
    files: shortPaths,
    items: Object.entries(results).reduce((acc, [longPath, value]) => {
      for (const [id, result] of Object.entries(value)) {
        const key = `${pathMap.get(longPath)}:${id}`

        switch (result.type) {
          case 'NEW': {
            acc[key] = {
              type: 'NEW',
              width: result.width,
              height: result.height,
            }

            break
          }
          case 'DIFF': {
            acc[key] = {
              type: 'DIFF',
              newWidth: result.newWidth,
              newHeight: result.newHeight,
              origWidth: result.origWidth,
              origHeight: result.origHeight,
            }

            break
          }
          case 'DELETED': {
            acc[key] = {
              type: 'DELETED',
              width: result.width,
              height: result.height,
            }

            break
          }
        }
      }

      return acc
    }, {} as TItems),
  }
}
