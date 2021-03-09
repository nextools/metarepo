import type { TFileWithData } from './types'

export const read = async (filePath: string): Promise<TFileWithData> => {
  const { readFile } = await import('fs/promises')
  const { sleep } = await import('sleap')

  await sleep(1000)

  return {
    path: filePath,
    data: await readFile(filePath, 'utf8'),
  }
}
