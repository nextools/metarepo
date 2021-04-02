import type { TTask } from './types'

export const buildTypes: TTask<string, string> = async function* (pkg) {
  const { pipe } = await import('funcom')
  const { find } = await import('./find')
  const { remove } = await import('./remove')
  const { typescriptGenerate } = await import('./typescript-generate')
  const { mapThreadPool } = await import('@start/thread-pool')

  const outDir = `packages/${pkg}/build/types/`

  yield* pipe(
    find(outDir),
    remove,
    find(`packages/${pkg}/src/index.ts`),
    // buildIt(outDir),
    mapThreadPool(typescriptGenerate, outDir)
  )()
}
