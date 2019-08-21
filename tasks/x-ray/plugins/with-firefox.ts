/* eslint-disable import/named */
import plugin, { StartPlugin } from '@start/plugin'

export default (target: StartPlugin<{}, any>) =>
  plugin('with-firefox', ({ reporter }) => async () => {
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
      await execa('docker', ['stop', 'foxr-firefox'], {
        ...execaOptions,
        stderr: null,
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
          'deepsweet/firefox-headless-remote:64',
        ],
        execaOptions
      )

      return await targetRunner(reporter)()
    } finally {
      await execa('docker', ['stop', 'foxr-firefox'], execaOptions)
    }
  })
