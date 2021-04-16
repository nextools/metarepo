import type { TFile, TPlugin, TTask } from './types'

const buildIt = (outDir: string): TPlugin<string, TFile> => async function* (it) {
  const { pipe } = await import('funcom')
  const { read } = await import('./plugin-read')
  const { babel } = await import('./plugin-lib-babel')
  const { babelConfigBuildNode } = await import('./babel-config')
  const { rename } = await import('./plugin-rename')
  const { replaceExt } = await import('ekst')
  const { write } = await import('./plugin-write')

  yield* pipe(
    read,
    babel(babelConfigBuildNode),
    rename(replaceExt('.ts', '.js')),
    write(outDir)
  )(it)
}

export const buildNode: TTask<string, TFile> = async function* (pkg) {
  const { pipe } = await import('funcom')
  const { find } = await import('./plugin-find')
  const { remove } = await import('./plugin-remove')
  const { log } = await import('./plugin-log')
  const { mapThreadPool } = await import('@start/thread-pool')

  const outDir = `packages/${pkg}/build/node/`

  yield* pipe(
    find(outDir),
    remove,
    find(`packages/${pkg}/src/**/*.ts`),
    // buildIt(outDir),
    mapThreadPool(buildIt, [outDir], { groupBy: 8 }),
    log('node')
  )()
}
