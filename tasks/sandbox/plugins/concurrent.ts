import plugin from '@start/plugin'
import type { StartPlugin } from '@start/plugin'

export type StartPluginOrFalse<P, R> = StartPlugin<P, R> | false

export default (...targets: StartPluginOrFalse<any, any>[]) =>
  plugin('concurrent', ({ reporter }) => (props) => Promise.all(
    targets.map(async (target) => {
      if (target === false) {
        return
      }

      const targetRunner = await target

      await targetRunner(reporter)(props)
    })
  ))
