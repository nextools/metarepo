import FixedArray from 'circularr'
import { iterate } from './iterate'

const takeFirstAsync = (n: number) => <T>(iterable: AsyncIterable<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    if (n <= 0) {
      return
    }

    let i = 0

    for await (const value of iterable) {
      yield value

      if (++i >= n) {
        break
      }
    }
  },
})

const takeLastAsync = (n: number) => <T>(iterable: AsyncIterable<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    const last = new FixedArray<T>(n)
    let numValues = 0

    for await (const value of iterable) {
      last.shift(value)
      numValues++
    }

    /* skip empty values */
    const iterator = iterate(last)
    const offset = last.length - numValues

    for (let i = 0; i < offset; i++) {
      iterator.next()
    }

    /* actual values */
    for (const value of iterator) {
      yield value
    }
  },
})

export const takeAsync = (n: number) => (n < 0 ? takeLastAsync(-n) : takeFirstAsync(n))

