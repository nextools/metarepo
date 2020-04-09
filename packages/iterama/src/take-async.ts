import FixedArray from 'circularr'
import { iterate } from './iterate'
import { iterateAsync } from './iterate-async'

const takeFirstAsync = (n: number) => <T>(iterable: AsyncIterable<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    const asyncGenerator = iterateAsync(iterable)
    let i = 0

    while (i < n) {
      const result = await asyncGenerator.next()

      if (result.done) {
        break
      }

      i++

      yield result.value
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

    const iterator = iterate(last)

    /* skip empty values */
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

