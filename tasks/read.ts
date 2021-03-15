import type { TFileWithData } from './types'

export const read = async (filePath: string): Promise<TFileWithData> => {
  const { readFile } = await import('fs/promises')
  const { sleep } = await import('sleap')
  const { getRandomInt } = await import('rndi')

  await sleep(getRandomInt(200, 500))

  return {
    path: filePath,
    data: await readFile(filePath, 'utf8'),
  }
}
