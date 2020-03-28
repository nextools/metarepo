/* eslint-disable no-var, no-empty, block-scoped-var */
import { iterate } from './iterate'

export const length = (maxLength: number) => <T> (iterable: Iterable<T>): number => {
  for (var i = 0, it = iterate(iterable); i < maxLength && !it.next().done; ++i) { }

  return i
}
