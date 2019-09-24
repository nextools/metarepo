import plugin from '@start/plugin'

export type Options = {
  [key: string]: boolean | string | string[],
}

export default (userOptions?: Options) =>
  plugin('typescriptCheck', () => async () => {
    const { default: execa } = await import('execa')

    const options: Options = {
      ...userOptions,
      project: '.',
      noEmit: true,
    }
    const tscArgs = Object.keys(options).reduce((result, key) => {
      const value = options[key]

      if (typeof value === 'boolean') {
        return result.concat(`--${key}`)
      }

      if (typeof value === 'string') {
        return result.concat(`--${key}`, `${value}`)
      }

      if (Array.isArray(value)) {
        return result.concat(`--${key}`, `${value.join(',')}`)
      }

      return result
    }, [] as string[])

    await execa('tsc', tscArgs, {
      stdout: process.stdout,
      stderr: process.stderr,
    })
  })
