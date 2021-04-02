import type { TPlugin } from './types'

export const copy = (outDir: string): TPlugin<string, string> => async function* (it) {
  const { mapAsync } = await import('iterama')
  const path = await import('path')
  const { default: movePath } = await import('move-path')
  const { makeDir } = await import('dirdir')
  const { default: copie } = await import('copie')

  yield* mapAsync(async (inFilePath: string) => {
    const outFilePath = movePath(inFilePath, outDir)
    const newDir = path.dirname(outFilePath)

    await makeDir(newDir)
    await copie(inFilePath, outFilePath)

    return outFilePath
  })(it)
}
