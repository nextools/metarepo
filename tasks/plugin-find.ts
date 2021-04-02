import type { TMaybeInputPlugin } from './types'

export const find = (globs: string | string[]): TMaybeInputPlugin<any, string> => async function* (it) {
  const { matchGlobs } = await import('iva')
  const { isArray, isAsyncIterable } = await import('tsfn')
  const { drainAsync } = await import('iterama')

  if (isAsyncIterable(it)) {
    await drainAsync(it)
  }

  yield* matchGlobs(isArray(globs) ? globs : [globs])
}
