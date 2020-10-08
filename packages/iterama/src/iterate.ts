export function *iterate <T>(iterable: Iterable<T>): Generator<T, any, any> {
  yield* iterable
}
