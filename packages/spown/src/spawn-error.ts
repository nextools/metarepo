export class SpawnError extends Error {
  exitCode: number

  constructor(message: string, exitCode: number) {
    super()

    this.message = message
    this.exitCode = exitCode
    this.stack = undefined
  }
}
