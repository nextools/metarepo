# spown ![npm](https://flat.badgen.net/npm/v/spown)

Spawn child process.

## Install

```sh
$ yarn add spown
```

## Usage

```ts
type TSpawnChildProcessOptions = {
  argv0?: string,
  cwd?: string,
  env?: NodeJS.ProcessEnv,
  stdin?: Stream | null,
  stdout?: Stream | null,
  stderr?: Stream | null,
  uid?: number,
  gid?: number,
  serialization?: 'json' | 'advanced'
}

const spawnChildProcess: (command: string, options?: TSpawnChildProcessOptions) => Promise<{
  stdout: string | null,
  stderr: string | null
}>
```

```ts
type TSpawnChildProcessStreamOptions = {
  argv0?: string,
  cwd?: string,
  env?: NodeJS.ProcessEnv,
  stdin?: Stream | null,
  stdout?: Stream | null,
  stderr?: Stream | null,
  shouldCreateIpcChannel?: boolean,
  uid?: number,
  gid?: number,
  serialization?: 'json' | 'advanced'
}

const spawnChildProcessStream: (command: string, options?: TSpawnChildProcessStreamOptions) => ChildProcess
```

```ts
import { spawnChildProcess, spawnChildProcessStream } from 'spown'
import { unchunkString } from 'unchunk'

console.log(
  await spawnChildProcess('ls /')
)
// {
//   stdout: 'Applications  Library  System  …',
//   stderr: ''
// }

try {
  await spawnChildProcess('ls /foo')
} catch (e) {
  console.error(e.message)
  // ls: cannot access '/foo': No such file or directory
  console.error(e.exitCode)
  // 2
}

const childProcess = spawnChildProcessStream('ls /foo')
const stderr = await unchunkString(childProcess.stderr)

console.log(stderr)
// ls: cannot access '/foo': No such file or directory
```
