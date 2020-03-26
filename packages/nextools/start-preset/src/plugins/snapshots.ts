/* eslint-disable import/named */
import plugin, { StartFilesProps } from '@start/plugin'
import { TOptions } from '@x-ray/common-utils'

export default (options: TOptions) =>
  plugin<StartFilesProps, void>('x-ray-snapshots', () => async ({ files }) => {
    const { runFiles } = await import('@x-ray/snapshots')

    return runFiles(files.map((file) => file.path), options)
  })
