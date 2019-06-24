import plugin, { StartDataFilesProps } from '@start/plugin'

export default plugin('codecov', ({ logMessage }) => async ({ files }: StartDataFilesProps) => {
  const { default: codecovLite } = await import('codecov-lite')

  await Promise.all(
    files.map(async (file) => {
      const { reportURL } = await codecovLite(file.data)

      logMessage(reportURL)
    })
  )

  return files
})
