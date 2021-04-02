export type TConcat = {
  <T1>(it1: Iterable<T1>): Iterable<T1>,
  <T1, T2>(it1: Iterable<T1>, it2: Iterable<T2>): Iterable<T1 | T2>,
  <T1, T2, T3>(it1: Iterable<T1>, it2: Iterable<T2>, it3: Iterable<T3>): Iterable<T1 | T2 | T3>,
  <T1, T2, T3, T4>(it1: Iterable<T1>, it2: Iterable<T2>, it3: Iterable<T3>, it4: Iterable<T4>): Iterable<T1 | T2 | T3 | T4>,
  <T1, T2, T3, T4, T5>(it1: Iterable<T1>, it2: Iterable<T2>, it3: Iterable<T3>, it4: Iterable<T4>, it5: Iterable<T5>): Iterable<T1 | T2 | T3 | T4 | T5>,
  <T1, T2, T3, T4, T5, T6>(it1: Iterable<T1>, it2: Iterable<T2>, it3: Iterable<T3>, it4: Iterable<T4>, it5: Iterable<T5>, it6: Iterable<T6>): Iterable<T1 | T2 | T3 | T4 | T5 | T6>,
}

export const concat: TConcat = (...iterables: Iterable<any>[]): Iterable<any> => ({
  *[Symbol.iterator]() {
    for (const it of iterables) {
      yield* it
    }
  },
})
