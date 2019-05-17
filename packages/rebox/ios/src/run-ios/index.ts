import execa from 'execa'

// https://github.com/facebook/react-native/issues/9145
// https://github.com/facebook/react-native/pull/23616
const PORT = '8082'

export type TRunIosOptions = {
  entryPointPath: string,
}

export const runIos = (options: TRunIosOptions) => Promise.all([
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
      'run-ios',
      '--port',
      PORT,
      '--no-packager',
      '--project-path',
      'node_modules/@rebox/ios/ios',
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
