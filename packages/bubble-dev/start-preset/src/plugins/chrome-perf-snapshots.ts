import plugin, { StartFilesProps } from '@start/plugin'

export default (fontsDir?: string) =>
  plugin<StartFilesProps, void>('x-ray', () => async ({ files }) => {
    const { checkChromePerfSnapshots } = await import('@x-ray/chrome-perf-snapshots')

    return checkChromePerfSnapshots({
      targetFiles: files.map((file) => file.path),
      fontsDir,
    })
  })
