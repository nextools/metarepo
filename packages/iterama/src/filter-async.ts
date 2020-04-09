export type TFilterFnAsync<T> = (arg: T, index: number) => Promise<boolean> | boolean

export const filterAsync = <T>(filterFn: TFilterFnAsync<T>) => (iterable: AsyncIterable<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    let i = 0

    for await (const value of iterable) {
      if (await filterFn(value, i++)) {
        yield value
      }
    }
  },
})

