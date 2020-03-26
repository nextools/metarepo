import plugin, { StartPlugin } from '@start/plugin'

export default (target: StartPlugin<{}, any>, fontsDir?: string) =>
  plugin('with-firefox', ({ reporter }) => async () => {
    const { default: execa } = await import('execa')
    const { isString } = await import('tsfn')
    const path = await import('path')

    const targetRunner = await target

    try {
      await execa('docker', ['stop', 'foxr-firefox'], {
        reject: false,
      })
      await execa(
        'docker',
        [
          'run',
          '-id',
          '--rm',
          '--shm-size',
          '2g',
          '-p',
          '2828:2828',
          '--name',
          'foxr-firefox',
          ...(isString(fontsDir)
            ?
            [
              '-v',
              `${path.resolve(fontsDir)}:/home/firefox/.fonts:ro`,
            ]
            : []
          ),
          'deepsweet/firefox-headless-remote:68',
        ],
        {
          stderr: process.stderr,
          env: {
            FORCE_COLOR: '1',
          },
        }
      )

      return await targetRunner(reporter)()
    } finally {
      await execa('docker', ['stop', 'foxr-firefox'])
    }
  })
