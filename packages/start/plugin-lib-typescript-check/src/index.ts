import plugin from '@start/plugin'

export type Options = {
  [key: string]: boolean | string | string[],
}

export default (userOptions?: Options) =>
  plugin('typescriptCheck', () => async () => {
    const { spawnChildProcess } = await import('spown')

    const options: Options = {
      ...userOptions,
      project: '.',
      noEmit: true,
    }
    let cmd = 'tsc'

    for (const [key, value] of Object.entries(options)) {
      if (typeof value === 'boolean') {
        cmd += ` --${key}`
      } else if (typeof value === 'string') {
        cmd += ` --${key} ${value}`
      } else if (Array.isArray(value)) {
        cmd += ` --${key} ${value.join(',')}`
      }
    }

    try {
      await spawnChildProcess(cmd, {
        stdout: process.stdout,
        stderr: process.stderr,
      })
    } catch {
      throw null
    }
  })
