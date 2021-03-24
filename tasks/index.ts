import type { TFile, TNoInputTask, TTask } from './types'

const buildNodeAndWeb = (dir: string): TTask<string, TFile> => async function *(it) {
  const { mergeTasks } = await import('./merge-tasks')
  const { buildNode } = await import('./build-node')
  const { buildWeb } = await import('./build-web')

  yield* mergeTasks(buildNode(dir), buildWeb(dir))(it)
}

export const build = (pkg: string): TNoInputTask<TFile> => async function *() {
  const { pipe } = await import('funcom')
  const { pipeThreadPool } = await import('@start/thread-pool')
  const { find } = await import('./find')
  const { remove } = await import('./remove')

  const outDir = `packages/${pkg}/build/`

  yield* pipe(
    find([outDir]),
    remove,
    find([`packages/${pkg}/src/*.ts`]),
    // buildNodeAndWeb(outDir)
    pipeThreadPool(buildNodeAndWeb, outDir, {
      groupType: 'concurrent',
    })
  )()
}
