import plugin from '@start/plugin'
import { RollupOptions } from 'rollup'

export default (config: RollupOptions) =>
  plugin('rollup', () => async () => {
    const { rollup } = await import('rollup')

    const bundle = await rollup(config)

    if (typeof config.output === 'undefined') {
      throw new Error('config output is not defined')
    }

    await bundle.write(config.output)
  })
