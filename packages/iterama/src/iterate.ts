export function *iterate <T>(iterable: Iterable<T>): IterableIterator<T> {
  for (const value of iterable) {
    yield value
  }
}
