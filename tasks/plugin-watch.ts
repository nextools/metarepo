import type { TMaybeInputPlugin } from './types'

export const watch = (globs: string | string[]): TMaybeInputPlugin<any, string> => async function* (it) {
  const { watch } = await import('wotch')
  const { isAsyncIterable } = await import('tsfn')
  const { drainAsync } = await import('iterama')

  if (isAsyncIterable(it)) {
    await drainAsync(it)
  }

  yield* watch(globs)
}
