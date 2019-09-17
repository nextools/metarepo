import plugin, { StartFilesProps } from '@start/plugin'
import { TUserOptions } from '@x-ray/chrome-screenshots'

export default (options: TUserOptions) =>
  plugin<StartFilesProps, void>('x-ray', () => async ({ files }) => {
    const { runFiles } = await import('@x-ray/chrome-screenshots')

    return runFiles(files.map((file) => file.path), options)
  })
