import type { TFileWithData } from './types'

export const read = async (iterable: AsyncIterable<string>): Promise<AsyncIterable<TFileWithData>> => {
  const { readFile } = await import('fs/promises')
  const { mapAsync } = await import('iterama')
  const { sleep } = await import('sleap')
  const { getRandomInt } = await import('rndi')

  return mapAsync(async (filePath: string) => {
    await sleep(getRandomInt(200, 500))

    return {
      path: filePath,
      data: await readFile(filePath, 'utf8'),
    }
  })(iterable)
}
