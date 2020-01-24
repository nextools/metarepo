import plugin, { StartFilesProps } from '@start/plugin'

export default () =>
  plugin<StartFilesProps, void>('x-ray', () => async ({ files }) => {
    const { runFiles } = await import('@x-ray/bundle-size-snapshots')

    return runFiles(files.map((file) => file.path))
  })
