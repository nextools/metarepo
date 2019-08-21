import execa from 'execa'
import { serveJsBundle } from './serve-js-bundle'

const PORT = 8082

export type TRunIosOptions = {
  projectPath: string,
  entryPointPath: string,
}

export const run = async (options: TRunIosOptions) => {
  await serveJsBundle({ entryPointPath: options.entryPointPath, port: PORT })

  await execa(
    'react-native',
    [
      'run-ios',
      '--port',
      String(PORT),
      '--no-packager',
      '--project-path',
      options.projectPath,
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

