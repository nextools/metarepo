import path from 'path'
import execa from 'execa'
import { runEmulator } from './run-emulator'
import { serveJsBundle } from './serve-js-bundle'

// https://github.com/facebook/react-native/issues/9145
// https://github.com/facebook/react-native/pull/23616
const PORT = 8081

export type TOptions = {
  projectPath: string,
  entryPointPath: string,
  portsToForward: number[],
}

export const run = async (options: TOptions) => {
  await Promise.all([
    serveJsBundle({
      entryPointPath: options.entryPointPath,
      port: PORT,
    }),
    runEmulator({
      isHeadless: false,
      portsToForward: [PORT, ...options.portsToForward],
    }),
  ])

  await execa(
    'react-native',
    [
      'run-android',
      '--port',
      String(PORT),
      '--no-packager',
      '--root',
      path.join(options.projectPath, '..'),
    ],
    {
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
        RCT_METRO_PORT: String(PORT),
      },
    }
  )
}
