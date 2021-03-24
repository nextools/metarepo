import type { TFile, TTask } from './types'

export const read: TTask<string, TFile> = async function *(it) {
  const { readFile } = await import('fs/promises')
  const { mapAsync } = await import('iterama')

  yield* mapAsync(async (filePath: string) => {
    const data = await readFile(filePath, 'utf8')

    return {
      path: filePath,
      data,
    }
  })(it)
}
