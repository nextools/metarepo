import type { TPlugin } from '@start/types'

export const copy = (outDir: string): TPlugin<string, string> => async function* (it) {
  const { dirname } = await import('path')
  const { default: movePath } = await import('move-path')
  const { makeDir } = await import('dirdir')
  const { default: copie } = await import('copie')

  for await (const inFilePath of it) {
    const outFilePath = movePath(inFilePath, outDir)
    const newDir = dirname(outFilePath)

    await makeDir(newDir)
    await copie(inFilePath, outFilePath)

    yield outFilePath
  }
}
