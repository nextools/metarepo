import FixedArray from 'circularr'
import { iterate } from './iterate'

const skipFirst = (n: number) => <T> (iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    const it = iterate(iterable)
    let i = 0

    // eslint-disable-next-line no-empty
    while (i++ < n && !it.next().done) { }

    for (const value of it) {
      yield value
    }
  },
})

const skipLast = (n: number) => <T> (iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    const it = iterate(iterable)
    const last = new FixedArray<T>(n)

    for (let i = 0; i < n; ++i) {
      const res = it.next()

      if (res.done) {
        break
      }

      last.shift(res.value)
    }

    for (const value of it) {
      yield last.shift(value)
    }
  },
})

export const skip = (n: number) =>
  (n < 0 ? skipLast(-n) : skipFirst(n))

