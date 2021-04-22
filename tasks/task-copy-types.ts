import type { TTask } from '@start/types'

export const copyTypes: TTask<string, string> = async function* (pkg) {
  const { pipe } = await import('funcom')
  const { find } = await import('./plugin-find')
  const { remove } = await import('./plugin-remove')
  const { copy } = await import('./plugin-copy')
  const { log } = await import('./plugin-log')

  const outDir = `packages/${pkg}/build/types/`

  yield* pipe(
    find(outDir),
    remove,
    find(`packages/${pkg}/src/**/*.d.ts`),
    copy(outDir),
    log('types')
  )()
}
