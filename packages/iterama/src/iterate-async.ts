export async function *iterateAsync <T>(iterable: AsyncIterable<T>): AsyncIterableIterator<T> {
  for await (const value of iterable) {
    yield value
  }
}
