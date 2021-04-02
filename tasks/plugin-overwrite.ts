import type { TFile, TPlugin } from './types'

export const overwrite: TPlugin<TFile, TFile> = async function* (it) {
  const { mapAsync } = await import('iterama')
  const { writeFile } = await import('fs/promises')

  yield* mapAsync(async (file: TFile) => {
    await writeFile(file.path, file.data, 'utf8')

    return file
  })(it)
}
