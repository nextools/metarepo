import path from 'path'
import { mkdir } from 'pifs'

export const makeDir = async (dirPath: string): Promise<string | null> => {
  const result = await mkdir(dirPath, { recursive: true })

  if (typeof result === 'undefined') {
    return null
  }

  return path.resolve(dirPath)
}
