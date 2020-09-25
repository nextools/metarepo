import plugin from '@start/plugin'

export default (command: string) =>
  plugin('spawn', () => async () => {
    const { spawnChildProcess } = await import('spown')

    try {
      await spawnChildProcess(command, {
        stdout: process.stdout,
        stderr: process.stderr,
      })
    } catch {
      throw null
    }
  })
