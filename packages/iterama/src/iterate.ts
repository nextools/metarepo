export function *iterate <T>(iterable: Iterable<T>): IterableIterator<T> {
  yield* iterable
}
