import FixedArray from 'circularr'
import { iterate } from './iterate'

const takeFirst = (n: number) => <T>(iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    if (n <= 0) {
      return
    }

    let i = 0

    for (const value of iterable) {
      yield value

      if (++i >= n) {
        break
      }
    }
  },
})

const takeLast = (n: number) => <T>(iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    const last = new FixedArray<T>(n)
    let numValues = 0

    for (const value of iterable) {
      last.shift(value)
      ++numValues
    }

    // skip empty values
    const iterator = iterate(last)
    const offset = last.length - numValues

    for (let i = 0; i < offset; i++) {
      iterator.next()
    }

    // actual values
    for (const value of iterator) {
      yield value
    }
  },
})

export const take = (n: number) => (n < 0 ? takeLast(-n) : takeFirst(n))

