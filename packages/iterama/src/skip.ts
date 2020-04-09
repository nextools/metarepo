import FixedArray from 'circularr'
import { iterate } from './iterate'

const skipFirst = (n: number) => <T>(iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    const iterator = iterate(iterable)
    let i = 0

    while (i < n && !iterator.next().done) {
      i++
    }

    for (const value of iterator) {
      yield value
    }
  },
})

const skipLast = (n: number) => <T>(iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    const iterator = iterate(iterable)
    const last = new FixedArray<T>(n)

    for (let i = 0; i < n; i++) {
      const result = iterator.next()

      if (result.done) {
        break
      }

      last.shift(result.value)
    }

    for (const value of iterator) {
      yield last.shift(value)
    }
  },
})

export const skip = (n: number) => (n < 0 ? skipLast(-n) : skipFirst(n))

