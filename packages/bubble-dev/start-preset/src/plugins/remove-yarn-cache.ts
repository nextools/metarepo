import plugin from '@start/plugin'
import { TPluginData } from '@auto/start-plugin'

export const removeYarnCache =
  plugin<TPluginData, any>('removeYarnCache', ({ logMessage }) => async ({ packagesBumps }) => {
    const path = await import('path')
    const { readdir } = await import('pifs')
    const { default: dleet } = await import('dleet')
    const { default: execa } = await import('execa')

    const { stdout: yarnCacheDir } = await execa('yarn', ['cache', 'dir'])
    const yarnCacheList = await readdir(yarnCacheDir)
    const bumpNames = packagesBumps.map((bump) => `npm-${bump.name.replace('/', '-')}-${bump.version}`)

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
