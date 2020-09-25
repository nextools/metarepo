
import { EventEmitter } from 'events'
import { Readable } from 'stream'

type TChildProcess = EventEmitter & {
  exitCode: number | null,
  stdout: Readable | null,
  stderr: Readable | null,
  kill: () => void,
}

type TMockChildProcessOptions = {
  stdout: string | null,
  stderr: string | null,
  exitCode: number | null,
}

export const createReadable = (str: string) => new Readable({
  read() {
    this.push(str)
    this.push(null)
  },
})

export const mockChildProcess = (options: TMockChildProcessOptions): TChildProcess => {
  const childProcess = new EventEmitter() as TChildProcess

  childProcess.exitCode = options.exitCode
  childProcess.stdout = null
  childProcess.stderr = null

  if (options.stdout !== null) {
    childProcess.stdout = createReadable(options.stdout)
  }

  if (options.stderr !== null) {
    childProcess.stderr = createReadable(options.stderr)
  }

  return childProcess
}
