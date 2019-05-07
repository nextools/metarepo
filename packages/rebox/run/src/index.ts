import execa from 'execa'

export const runHaul = (entryPoint: string) => execa(
  'haul',
  [
    'start',
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
)

export const runIos = () => execa(
  'react-native',
  [
    'run-ios',
    '--no-packager',
    '--project-path',
    'node_modules/@rebox/ios/ios',
  ],
  {
    stdout: process.stdout,
    stderr: process.stderr,
    env: {
      FORCE_COLOR: '1',
    },
  }
)

export const runAndroid = async () => {
  await execa('bash', [require.resolve('@rebox/android/run-android-emulator.sh')], {
    stdout: process.stdout,
    stderr: process.stderr,
    env: {
      FORCE_COLOR: '1',
    },
  })

  return execa(
    'react-native',
    [
      'run-android',
      '--no-packager',
      '--root',
      'node_modules/@rebox/android',
    ],
    {
      stdout: process.stdout,
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
      },
    }
  )
}
