export type TMapFnAsync<T, R> = (value: T, i: number) => Promise<R> | R

export const mapAsync = <T, R>(mapFn: TMapFnAsync<T, R>) => (iterable: AsyncIterable<T> | Iterable<T>): AsyncIterable<R> => ({
  async *[Symbol.asyncIterator]() {
    let i = 0

    for await (const value of iterable) {
      yield mapFn(value, i++)
    }
  },
})
