import type { TFileWithData } from './types'

export const write = async (fileWithData: TFileWithData): Promise<TFileWithData> => {
  await Promise.resolve()

  return fileWithData
}
