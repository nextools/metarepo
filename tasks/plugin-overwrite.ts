import type { TFile, TPlugin } from '@start/types'

export const overwrite: TPlugin<TFile, TFile> = async function* (it) {
  const { writeFile } = await import('fs/promises')

  for await (const file of it) {
    await writeFile(file.path, file.data, 'utf8')

    yield file
  }
}
