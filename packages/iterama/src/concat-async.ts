import { iterateAsync } from './iterate-async'

export const concatAsync = <T>(...iterables: AsyncIterable<T>[]): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    for await (const it of iterables) {
      yield* iterateAsync(it)
    }
  },
})
