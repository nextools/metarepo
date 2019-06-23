import plugin, { StartFilesProps } from '@start/plugin'

export default plugin('remove', ({ logPath }) => async ({ files }: StartFilesProps) => {
  const { default: dleet } = await import('dleet')

  await Promise.all(
    files.map(async (file) => {
      await dleet(file.path)

      logPath(file.path)
    })
  )
})
