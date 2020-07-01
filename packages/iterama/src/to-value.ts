import { toIterator } from './to-iterator'

export const toValue = <T>(iterable: Iterable<T>): T => {
  const iterator = toIterator(iterable)
  const result = iterator.next()

  iterator.return?.()

  return result.value
}
