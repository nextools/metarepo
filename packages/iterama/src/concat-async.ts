export type TConcatAsync = {
  <T1>(it1: AsyncIterable<T1>): AsyncIterable<T1>,
  <T1, T2>(it1: AsyncIterable<T1>, it2: AsyncIterable<T2>): AsyncIterable<T1 | T2>,
  <T1, T2, T3>(it1: AsyncIterable<T1>, it2: AsyncIterable<T2>, it3: AsyncIterable<T3>): AsyncIterable<T1 | T2 | T3>,
  <T1, T2, T3, T4>(it1: AsyncIterable<T1>, it2: AsyncIterable<T2>, it3: AsyncIterable<T3>, it4: AsyncIterable<T4>): AsyncIterable<T1 | T2 | T3 | T4>,
  <T1, T2, T3, T4, T5>(it1: AsyncIterable<T1>, it2: AsyncIterable<T2>, it3: AsyncIterable<T3>, it4: AsyncIterable<T4>, it5: AsyncIterable<T5>): AsyncIterable<T1 | T2 | T3 | T4 | T5>,
  <T1, T2, T3, T4, T5, T6>(it1: AsyncIterable<T1>, it2: AsyncIterable<T2>, it3: AsyncIterable<T3>, it4: AsyncIterable<T4>, it5: AsyncIterable<T5>, it6: AsyncIterable<T6>): AsyncIterable<T1 | T2 | T3 | T4 | T5 | T6>,
}

export const concatAsync: TConcatAsync = (...iterables: AsyncIterable<any>[]): AsyncIterable<any> => ({
  async *[Symbol.asyncIterator]() {
    for await (const it of iterables) {
      yield* it
    }
  },
})
