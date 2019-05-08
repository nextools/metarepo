import execa from 'execa'

// https://github.com/facebook/react-native/issues/9145
// https://github.com/facebook/react-native/pull/23616
const PORT = '8081'

export const runAndroid = async (entryPoint: string) => {
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
          REBOX_ENTRY_POINT: entryPoint,
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
