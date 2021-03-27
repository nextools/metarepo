import type { TFile, TPlugin, TTask } from './types'

const buildIt = (outDir: string): TPlugin<string, TFile> => async function* (it) {
  const { pipe } = await import('funcom')
  const { read } = await import('./read')
  const { rename } = await import('./rename')
  const { babel } = await import('./babel')
  const { babelConfigBuildWeb } = await import('./babel-config')
  const { write } = await import('./write')

  yield* pipe(
    read,
    babel(babelConfigBuildWeb),
    rename(/\.tsx?$/, '.js'),
    write(outDir)
  )(it)
}

export const buildWeb: TTask<string, TFile> = async function* (pkg) {
  const { pipe } = await import('funcom')
  const { find } = await import('./find')
  const { remove } = await import('./remove')
  const { mapThreadPool } = await import('@start/thread-pool')

  const outDir = `packages/${pkg}/build/web/`

  yield* pipe(
    find([outDir]),
    remove,
    find([`packages/${pkg}/src/*.ts`]),
    mapThreadPool(buildIt, outDir, { groupBy: 8 })
  )()
}
