export type TScanFnAsync<T, R> = (acc: R, value: T, index: number) => Promise<R> | R

export const scanAsync = <T, R>(scanFn: TScanFnAsync<T, R>, initial: Promise<R> | R) => (iterable: AsyncIterable<T> | Iterable<T>): AsyncIterable<R> => ({
  async *[Symbol.asyncIterator]() {
    let state = await initial
    let i = 0

    for await (const value of iterable) {
      state = await scanFn(state, value, i++)
      yield state
    }
  },
})

