import type { ChildProcess } from 'child_process'
import crossSpawn from 'cross-spawn'
import { hookOnExit, processPool } from './processes'
import { splitCommand } from './split-command'
import type { TSpawnChildProcessStreamOptions } from './types'

export const spawnChildProcessStream = (command: string, options?: TSpawnChildProcessStreamOptions): ChildProcess => {
  hookOnExit()

  const [cmd, ...args] = splitCommand(command)
  const opts = {
    stdin: 'pipe' as const,
    stdout: 'pipe' as const,
    stderr: 'pipe' as const,
    shouldCreateIpcChannel: false,
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
      opts.shouldCreateIpcChannel ? 'ipc' : 'ignore',
    ],
  })

  processPool.add(childProcess)

  childProcess.once('close', () => {
    processPool.delete(childProcess)
  })

  return childProcess
}
