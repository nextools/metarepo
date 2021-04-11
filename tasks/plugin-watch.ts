import type { TMaybeInputPlugin } from './types'

export const watch = (dir: string): TMaybeInputPlugin<any, string> => async function* (it) {
  const { watchDir } = await import('wotch')
  const { isAsyncIterable } = await import('tsfn')
  const { drainAsync } = await import('iterama')

  if (isAsyncIterable(it)) {
    await drainAsync(it)
  }

  yield* watchDir(dir)
}
