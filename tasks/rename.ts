import type { TFile, TTask } from './types'

export const rename = (renameFn: (filePath: string) => string): TTask<TFile, TFile> => async function *(it) {
  const path = await import('path')
  const { mapAsync } = await import('iterama')
  const { isObject } = await import('tsfn')

  yield* mapAsync((file: TFile) => {
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
  })(it)
}
