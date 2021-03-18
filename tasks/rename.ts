import type { TFile } from './types'

export const rename = (renameFn: (filePath: string) => string) => async (iterable: AsyncIterable<TFile>): Promise<AsyncIterable<TFile>> => {
  const path = await import('path')
  const { mapAsync } = await import('iterama')
  const { isObject } = await import('tsfn')

  return mapAsync((file: TFile) => {
    const newFilePath = renameFn(file.path)

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
  })(iterable)
}
