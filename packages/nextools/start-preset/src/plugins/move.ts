import plugin from '@start/plugin'
import type { StartFilesProps } from '@start/plugin'

export default (renamer: (oldPath: string) => string) =>
  plugin<StartFilesProps, StartFilesProps>('move', ({ logPath }) => async ({ files }) => {
    const { dirname } = await import('path')
    const { rename } = await import('pifs')
    const { default: makeDir } = await import('make-dir')

    return {
      files: await Promise.all(
        files.map(async (file) => {
          const outFile = renamer(file.path)
          const outDir = dirname(outFile)

          await makeDir(outDir)
          await rename(file.path, outFile)

          logPath(outFile)

          return file
        })
      ),
    }
  })
