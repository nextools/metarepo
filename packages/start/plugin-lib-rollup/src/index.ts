import plugin from '@start/plugin'
import { RollupOptions } from 'rollup'
import { isArray } from 'tsfn'

export default (config: RollupOptions) =>
  plugin('rollup', () => async () => {
    const { rollup } = await import('rollup')

    const bundle = await rollup(config)

    if (typeof config.output === 'undefined') {
      throw new Error('config output is not defined')
    }

    if (isArray(config.output)) {
      for (const output of config.output) {
        await bundle.write(output)
      }
    } else {
      await bundle.write(config.output)
    }
  })
