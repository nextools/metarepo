import plugin from '@start/plugin'
import { THookProps } from '@auto/core'
import { TReadonly } from 'tsfn'

export default plugin<TReadonly<THookProps>, any>('removeYarnCache', ({ logMessage }) => async ({ packages }) => {
  const path = await import('path')
  const { readdir } = await import('pifs')
  const { default: dleet } = await import('dleet')
  const { default: execa } = await import('execa')

  const { stdout: yarnCacheDir } = await execa('yarn', ['cache', 'dir'])
  const yarnCacheList = await readdir(yarnCacheDir)
  const bumpNames = packages
    .filter((pkg) => pkg.version !== null)
    .map((pkg) => `npm-${pkg.name.replace('/', '-')}-${pkg.version}`)

  for (const item of yarnCacheList) {
    for (const bumpName of bumpNames) {
      if (item.startsWith(bumpName)) {
        const fullPathToDelete = path.join(yarnCacheDir, item)

        await dleet(fullPathToDelete)

        logMessage(item)
      }
    }
  }
})
