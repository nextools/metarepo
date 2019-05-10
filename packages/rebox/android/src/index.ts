import execa from 'execa'

// https://github.com/facebook/react-native/issues/9145
// https://github.com/facebook/react-native/pull/23616
const PORT = '8081'

export type TOptions = {
  entryPointPath: string,
}

export const runAndroid = async (options: TOptions) => {
  await execa('bash', [require.resolve('@rebox/android/android/run-android-emulator.sh')], {
    stdout: process.stdout,
    stderr: process.stderr,
    env: {
      FORCE_COLOR: '1',
    },
  })

  return Promise.all([
    execa(
      'haul',
      [
        'start',
        '--port',
        PORT,
        '--config',
        require.resolve('./haul.config.js'),
      ],
      {
        stdin: process.stdin,
        stdout: process.stdout,
        stderr: process.stderr,
        env: {
          FORCE_COLOR: '1',
          REBOX_ENTRY_POINT: options.entryPointPath,
        },
      }
    ),
    execa(
      'react-native',
      [
        'run-android',
        '--port',
        PORT,
        '--no-packager',
        '--root',
        'node_modules/@rebox/android',
      ],
      {
        stdout: process.stdout,
        stderr: process.stderr,
        env: {
          FORCE_COLOR: '1',
          RCT_METRO_PORT: PORT,
        },
      }
    ),
  ])
}
