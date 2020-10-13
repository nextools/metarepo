export async function *iterateAsync <T>(iterable: AsyncIterable<T>): AsyncGenerator<T, any, any> {
  yield* iterable
}
