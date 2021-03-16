import type { TFileWithData } from './types'

export const write = async (iterable: AsyncIterable<TFileWithData>): Promise<AsyncIterable<TFileWithData>> => {
  const { mapAsync } = await import('iterama')

  return mapAsync(async (fileWithData: TFileWithData) => {
    await Promise.resolve()

    return fileWithData
  })(iterable)
}
