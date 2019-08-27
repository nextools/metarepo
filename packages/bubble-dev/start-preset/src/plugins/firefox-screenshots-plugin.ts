import plugin, { StartFilesProps } from '@start/plugin'
import { TUserOptions } from '@x-ray/firefox-screenshots'

export default (options: TUserOptions) =>
  plugin<StartFilesProps, void>('x-ray-firefox-screenshots', () => async ({ files }) => {
    const { runFiles } = await import('@x-ray/firefox-screenshots')

    return runFiles(files.map((file) => file.path), options)
  })
