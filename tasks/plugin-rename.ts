import type { TFile, TPlugin } from '@start/types'

export const rename = (replaceFn: (filePath: string) => string): TPlugin<TFile, TFile> => async function* (it) {
  const { basename } = await import('path')
  const { isObject } = await import('tsfn')

  for await (const file of it) {
    const newFilePath = replaceFn(file.path)

    if (isObject(file.map)) {
      yield {
        path: newFilePath,
        data: file.data,
        map: {
          ...file.map,
          file: basename(newFilePath),
        },
      }
    } else {
      yield {
        path: newFilePath,
        data: file.data,
      }
    }
  }
}
