export type TForEachFnAsync<T> = (value: T, i: number) => Promise<void> | void

export const forEachAsync = <T>(forEachFn: TForEachFnAsync<T>) => (iterable: AsyncIterable<T> | Iterable<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    let i = 0

    for await (const value of iterable) {
      await forEachFn(value, i++)

      yield value
    }
  },
})
