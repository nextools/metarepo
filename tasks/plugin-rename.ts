import type { TFile, TPlugin } from './types'

export const rename = (replaceFn: (filePath: string) => string): TPlugin<TFile, TFile> => async function* (it) {
  const path = await import('path')
  const { mapAsync } = await import('iterama')
  const { isObject } = await import('tsfn')

  yield* mapAsync((file: TFile) => {
    const newFilePath = replaceFn(file.path)

    if (isObject(file.map)) {
      return {
        path: newFilePath,
        data: file.data,
        map: {
          ...file.map,
          file: path.basename(newFilePath),
        },
      }
    }

    return {
      path: newFilePath,
      data: file.data,
    }
  })(it)
}
