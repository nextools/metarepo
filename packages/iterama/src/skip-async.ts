import FixedArray from 'circularr'
import { iterateAsync } from './iterate-async'

const skipFirstAsync = (n: number) => <T>(iterable: AsyncIterable<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    const asyncGenerator = iterateAsync(iterable)
    let i = 0

    while (i < n) {
      const result = await asyncGenerator.next()

      if (result.done === true) {
        break
      }

      i++
    }

    for await (const value of asyncGenerator) {
      yield value
    }
  },
})

const skipLastAsync = (n: number) => <T>(iterable: AsyncIterable<T>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    const asyncGenerator = iterateAsync(iterable)
    const last = new FixedArray<T>(n)

    for (let i = 0; i < n; i++) {
      const result = await asyncGenerator.next()

      if (result.done === true) {
        break
      }

      last.shift(result.value)
    }

    for await (const value of asyncGenerator) {
      yield last.shift(value)
    }
  },
})

export const skipAsync = (n: number) => (n < 0 ? skipLastAsync(-n) : skipFirstAsync(n))

