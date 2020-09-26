import plugin from '@start/plugin'
import type { StartFilesProps } from '@start/plugin'

export default (outDirRelative: string) =>
  plugin('copy', ({ logPath }) => async ({ files }: StartFilesProps) => {
    const path = await import('path')
    const { default: movePath } = await import('move-path')
    const { makeDir } = await import('dirdir')
    const { default: copie } = await import('copie')

    return {
      files: await Promise.all(
        files.map(async (file) => {
          const outFile = movePath(file.path, outDirRelative)
          const outDir = path.dirname(outFile)

          await makeDir(outDir)
          await copie(file.path, outFile)

          logPath(outFile)

          return file
        })
      ),
    }
  })
