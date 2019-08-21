/* eslint-disable import/named */
import plugin, { StartPlugin } from '@start/plugin'

export default (target: StartPlugin<{}, void>) =>
  plugin('with-chromium', ({ reporter }) => async () => {
    const { default: execa } = await import('execa')

    const targetRunner = await target
    const execaOptions = {
      stderr: process.stderr,
      stripEof: true,
      env: {
        FORCE_COLOR: '1',
      },
    }

    try {
      await execa('docker', ['stop', 'chromium-headless-remote'], {
        ...execaOptions,
        stderr: null,
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
          'deepsweet/chromium-headless-remote:73',
        ],
        execaOptions
      )

      return await targetRunner(reporter)()
    } finally {
      await execa('docker', ['stop', 'chromium-headless-remote'], execaOptions)
    }
  })
