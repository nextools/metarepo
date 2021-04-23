import type { TTask } from '@start/types'

export const buildTypes: TTask<string, string> = async function* (pkg) {
  const { pipe } = await import('funcom')
  const { find } = await import('./plugin-find')
  const { remove } = await import('./plugin-remove')
  const { typescriptGenerate } = await import('./plugin-lib-typescript-generate')
  const { log } = await import('./plugin-log')
  const { mapThreadPool } = await import('@start/thread-pool')

  const outDir = `packages/${pkg}/build/types/`

  yield* pipe(
    find(outDir),
    remove,
    find(`packages/${pkg}/src/index.ts`),
    // typescriptGenerate(outDir),
    mapThreadPool(typescriptGenerate, [outDir]),
    log('types')
  )()
}
