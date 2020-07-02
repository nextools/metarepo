/* eslint-disable no-throw-literal */
import { THookProps } from '@auto/core'
import plugin, { StartPlugin } from '@start/plugin'
import { TReadonly } from 'tsfn'

export const forEachRelease = (task: (pkgDir: string) => StartPlugin<{}, any> | Promise<StartPlugin<{}, any>>) =>
  plugin<TReadonly<THookProps>, any>('forEachRelease', ({ reporter }) => async ({ packages }) => {
    const path = await import('path')
    const releasingPackages = packages.filter((pkg) => pkg.type !== null && pkg.version !== null)

    for (const pkg of releasingPackages) {
      const packageDir = path.relative(path.resolve('packages'), pkg.dir)
      const taskRunner = await task(packageDir)

      await taskRunner(reporter)()
    }
  })
