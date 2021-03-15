import type { TFileWithData } from './types'

export const read = async (filePath: string): Promise<TFileWithData> => {
  const { readFile } = await import('fs/promises')

  return {
    path: filePath,
    data: await readFile(filePath, 'utf8'),
  }
}
