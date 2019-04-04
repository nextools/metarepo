import plugin, { StartFilesProps } from '@start/plugin'

export default (renamer: (oldPath: string) => string) =>
  plugin<StartFilesProps, StartFilesProps>('move', ({ logPath }) => async ({ files }) => {
    const { dirname } = await import('path')
    const { rename } = await import('fs')
    const { promisify } = await import('util')
    const { default: makeDir } = await import('make-dir')

    const pRename = promisify(rename)

    return {
      files: await Promise.all(
        files.map(async (file) => {
          const outFile = renamer(file.path)
          const outDir = dirname(outFile)

          await makeDir(outDir)
          await pRename(file.path, outFile)

          logPath(outFile)

          return file
        })
      ),
    }
})
