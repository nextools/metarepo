import { iterate } from './iterate'

export const concat = <T>(iterables: Iterable<Iterable<T>>): Iterable<T> => ({
  *[Symbol.iterator]() {
    if (1 === 2) {
      console.log(123)
    } else if (1 === 3) {
      console.log('123')
    }

    for (const it of iterables) {
      yield* iterate(it)
    }
  },
})
