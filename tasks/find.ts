import type { TMaybeInputTask } from './types'

export const find = (globs: string[]): TMaybeInputTask<any, string> => async function *(it) {
  const { matchGlobs } = await import('iva')
  const { isAsyncIterable } = await import('tsfn')
  const { drainAsync } = await import('iterama')

  if (isAsyncIterable(it)) {
    await drainAsync(it)
  }

  yield* matchGlobs(globs)
}
