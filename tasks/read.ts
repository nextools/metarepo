import type { TFile } from './types'

export const read = async (iterable: AsyncIterable<string>): Promise<AsyncIterable<TFile>> => {
  const { readFile } = await import('fs/promises')
  const { mapAsync } = await import('iterama')

  return mapAsync(async (filePath: string) => {
    const data = await readFile(filePath, 'utf8')

    return {
      path: filePath,
      data,
    }
  })(iterable)
}
