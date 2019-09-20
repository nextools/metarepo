import plugin, { StartDataFile, StartFilesProps } from '@start/plugin'

export default plugin('read', ({ logPath }) => async ({ files }: StartFilesProps) => {
  const { readFile } = await import('pifs')

  return {
    files: await Promise.all(
      files.map(async (file): Promise<StartDataFile> => {
        const data = await readFile(file.path, 'utf8')

        logPath(file.path)

        return {
          path: file.path,
          data,
        }
      })
    ),
  }
})
