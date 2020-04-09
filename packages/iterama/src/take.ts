import FixedArray from 'circularr'
import { iterate } from './iterate'

const takeFirst = (n: number) => <T>(iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    const iterator = iterate(iterable)
    let i = 0

    while (i < n) {
      const result = iterator.next()

      if (result.done) {
        break
      }

      i++

      yield result.value
    }
  },
})

const takeLast = (n: number) => <T>(iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    const last = new FixedArray<T>(n)
    let numValues = 0

    for (const value of iterable) {
      last.shift(value)
      numValues++
    }

    const iterator = iterate(last)

    // skip empty values
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

