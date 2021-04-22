import type { TFile, TPlugin } from '@start/types'

export const read: TPlugin<string, TFile> = async function* (it) {
  const { readFile } = await import('fs/promises')

  for await (const filePath of it) {
    const data = await readFile(filePath, 'utf8')

    yield {
      path: filePath,
      data,
    }
  }
}
