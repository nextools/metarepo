import FixedArray from 'circularr'
import { iterate } from './iterate'

const takeFirst = (n: number) => <T> (iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    const it = iterate(iterable)
    let i = 0
    let ir: any

    while (i++ < n && !(ir = it.next()).done) {
      yield ir.value
    }
  },
})

const takeLast = (n: number) => <T> (iterable: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    const last = new FixedArray<T>(n)
    let numValues = 0

    for (const value of iterable) {
      last.shift(value)
      numValues++
    }

    const it = iterate(last)

    /* skip empty values */
    const offset = last.length - numValues

    for (let i = 0; i < offset; ++i) {
      it.next()
    }

    /* actual values */
    for (const value of it) {
      yield value
    }
  },
})

export const take = (n: number) =>
  (n < 0 ? takeLast(-n) : takeFirst(n))

