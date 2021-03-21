import type { TMaybeInputTask } from './types'

const drainAsync = async (iterable: AsyncIterable<any>): Promise<void> => {
  const iterator = iterable[Symbol.asyncIterator]()
  let result = await iterator.next()

  while (result.done !== true) {
    result = await iterator.next()
  }
}

export const find = (globs: string[]): TMaybeInputTask<any, string> => async (iterable) => {
  const { matchGlobs } = await import('iva')
  const { isAsyncIterable } = await import('tsfn')

  if (isAsyncIterable(iterable)) {
    await drainAsync(iterable)
  }

  return matchGlobs(globs)
}
