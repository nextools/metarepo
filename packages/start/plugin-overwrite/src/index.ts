import plugin, { StartDataFilesProps } from '@start/plugin'

export default plugin('overwrite', ({ logPath }) => async ({ files }: StartDataFilesProps) => {
  const { writeFile } = await import('pifs')

  return {
    files: await Promise.all(
      files.map(async (file) => {
        await writeFile(file.path, file.data, 'utf8')

        logPath(file.path)

        return file
      })
    ),
  }
})
