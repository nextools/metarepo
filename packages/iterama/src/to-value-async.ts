import { toIteratorAsync } from './to-iterator-async'

export const toValueAsync = async <T>(iterable: AsyncIterable<T>): Promise<T> => {
  const iterator = toIteratorAsync(iterable)
  const result = await iterator.next()

  await iterator.return?.()

  return result.value
}
