import type { TTask } from '@start/types'

export const ci: TTask<any, any> = async function* () {
  const { concatAsync } = await import('iterama')
  const { lint } = await import('./task-lint')
  const { tsc } = await import('./task-tsc')
  const { test } = await import('./task-test')

  yield* concatAsync(
    lint(),
    tsc(),
    test()
  )
}
