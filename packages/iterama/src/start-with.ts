import { concat } from './concat'

export const startWith = <T> (value: T) => (iterable: Iterable<T>) =>
  concat([value], iterable)
