import type { TFile, TPlugin } from './types'

type TSearchValue = {
  [Symbol.replace](input: string, replaceValue: string): string,
}

export const rename = (searchValue: TSearchValue, replaceValue: string): TPlugin<TFile, TFile> => async function* (it) {
  const path = await import('path')
  const { mapAsync } = await import('iterama')
  const { isObject } = await import('tsfn')

  yield* mapAsync((file: TFile) => {
    const newFilePath = file.path.replace(searchValue, replaceValue)

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
