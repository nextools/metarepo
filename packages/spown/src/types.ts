import type { Stream } from 'stream'

export type TSpawnChildProcessOptions = {
  argv0?: string,
  cwd?: string,
  env?: NodeJS.ProcessEnv,
  stdin?: Stream | null,
  stdout?: Stream | null,
  stderr?: Stream | null,
  uid?: number,
  gid?: number,
  serialization?: 'json' | 'advanced',
}

export type TSpawnChildProcessStreamOptions = {
  argv0?: string,
  cwd?: string,
  env?: NodeJS.ProcessEnv,
  stdin?: Stream | null,
  stdout?: Stream | null,
  stderr?: Stream | null,
  shouldCreateIpcChannel?: boolean,
  uid?: number,
  gid?: number,
  serialization?: 'json' | 'advanced',
}

export type TSpawnChildProcess = {
  (command: string, options: TSpawnChildProcessOptions & { stdout?: Stream, stderr?: Stream }): Promise<{ stdout: string, stderr: string }>,
  (command: string, options: TSpawnChildProcessOptions & { stdout: null, stderr: null }): Promise<{ stdout: null, stderr: null }>,
  (command: string, options: TSpawnChildProcessOptions & { stdout?: Stream, stderr: null }): Promise<{ stdout: string, stderr: null }>,
  (command: string, options: TSpawnChildProcessOptions & { stdout: null, stderr?: Stream }): Promise<{ stdout: null, stderr: string }>,
  (command: string): Promise<{ stdout: string, stderr: string }>,
}
