import type { TFile, TTask, TNoInputTask } from './types'

const buildIt = (dir: string): TTask<string, TFile> => async (it) => {
  const { pipeAsync } = await import('funcom')
  const { read } = await import('./read')
  const { rename } = await import('./rename')
  const { babel } = await import('./babel')
  const { babelConfigBuildNode } = await import('./babel-config')
  const { write } = await import('./write')

  return pipeAsync(
    read,
    babel(babelConfigBuildNode),
    rename((path) => path.replace(/\.tsx?$/, '.js')),
    write(dir)
  )(it)
}

export const build = (pkg: string): TNoInputTask<TFile> => async () => {
  const { pipeAsync } = await import('funcom')
  const { pipeThreadPool } = await import('@start/thread-pool')
  const { find } = await import('./find')
  const { remove } = await import('./remove')

  const outDir = `packages/${pkg}/build/`

  return pipeAsync(
    find([outDir]),
    remove,
    find([`packages/${pkg}/src/*.ts`]),
    // buildIt(outDir)
    pipeThreadPool(buildIt, outDir)
  )()
}
