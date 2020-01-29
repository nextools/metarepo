import plugin, { StartPlugin } from '@start/plugin'

const CHROMIUM_VERSION = 79

export default (target: StartPlugin<{}, void>, fontsDir?: string) =>
  plugin('with-chromium', ({ reporter }) => async () => {
    const { default: execa } = await import('execa')
    const { isString } = await import('tsfn')
    const path = await import('path')

    const targetRunner = await target

    try {
      await execa('docker', ['stop', 'chromium-headless-remote'], {
        reject: false,
      })
      await execa(
        'docker',
        [
          'run',
          '-d',
          '--rm',
          '-p',
          '9222:9222',
          '--name',
          'chromium-headless-remote',
          ...(isString(fontsDir)
            ?
            [
              '-v',
              `${path.resolve(fontsDir)}:/home/chromium/.fonts:ro`,
            ]
            : []
          ),
          `deepsweet/chromium-headless-remote:${CHROMIUM_VERSION}`,
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
      await execa('docker', ['stop', 'chromium-headless-remote'])
    }
  })
