import execa from 'execa'
import { TAnyObject } from 'tsfn'

const setupFile = require.resolve('./setup')

export const makeWorker = (childFile: string, options: TAnyObject) =>
  execa(
    'node',
    [
      setupFile,
      childFile,
      JSON.stringify(options),
    ],
    {
      stdio: ['ignore', process.stdout, process.stderr, 'ipc'],
    }
  )
