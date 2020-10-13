import crossSpawn from 'cross-spawn'
import { processPool, hookOnExit } from './processes'
import { SpawnError } from './spawn-error'
import { splitCommand } from './split-command'
import { streamToString } from './stream-to-string'
import type { TSpawnChildProcess, TSpawnChildProcessOptions } from './types'

export const spawnChildProcess: TSpawnChildProcess = async (command: string, options?: TSpawnChildProcessOptions) => {
  hookOnExit()

  const [cmd, ...args] = splitCommand(command)
  const opts = {
    stdin: 'pipe' as const,
    stdout: 'pipe' as const,
    stderr: 'pipe' as const,
    ...options,
  }
  const childProcess = crossSpawn(cmd, args, {
    argv0: opts.argv0,
    cwd: opts.cwd,
    env: {
      ...process.env,
      ...opts.env,
    },
    gid: opts.gid,
    uid: opts.uid,
    serialization: opts.serialization,
    stdio: [
      opts.stdin === null ? 'ignore' : opts.stdin,
      opts.stdout === null ? 'ignore' : opts.stdout,
      opts.stderr === null ? 'ignore' : opts.stderr,
      'ignore',
    ],
  })

  const [stdout, stderr] = await Promise.all([
    childProcess.stdout !== null ? streamToString(childProcess.stdout) : null,
    childProcess.stderr !== null ? streamToString(childProcess.stderr) : null,
  ])

  if (childProcess.exitCode === null) {
    processPool.add(childProcess)

    return new Promise<any>((resolve, reject) => {
      childProcess
        .once('error', reject)
        .once('close', (exitCode) => {
          processPool.delete(childProcess)

          if (exitCode === null || exitCode === 0) {
            resolve({ stdout, stderr })
          } else if (stderr === null) {
            reject(new SpawnError(`Child process exited with code ${exitCode}`, exitCode))
          } else {
            reject(new SpawnError(stderr, exitCode))
          }
        })
    })
  }

  if (childProcess.exitCode > 0) {
    if (stderr === null || stderr.length === 0) {
      throw new SpawnError(`Child process exited with code ${childProcess.exitCode}`, childProcess.exitCode)
    }

    throw new SpawnError(stderr, childProcess.exitCode)
  }

  return { stdout, stderr }
}
