import { TMaybePromise } from './types'

export const piAll = <T>(iterable: Iterable<() => TMaybePromise<any>>, concurrency: number = Infinity): AsyncIterable<T> => {
  if ((!Number.isSafeInteger(concurrency) && concurrency !== Infinity) || concurrency < 1) {
    throw new TypeError('`concurrency` argument must be a number >= 1')
  }

  return {
    async *[Symbol.asyncIterator]() {
      const pool = new Set<Promise<any>>()
      const iterator = iterable[Symbol.iterator]()
      let results = [] as T[]
      let isDone = false
      let hasError = false
      let error

      const next = async (): Promise<void> => {
        const iteration = iterator.next()

        if (iteration.done === true) {
          isDone = true

          return
        }

        let maybePromise

        try {
          maybePromise = iteration.value()

          pool.add(maybePromise)

          const result = await maybePromise

          results.push(result)

          if (!isDone && !hasError) {
            next()
          }
        } catch (err) {
          hasError = true
          error = err
        } finally {
          pool.delete(maybePromise)
        }
      }

      for (let i = 0; i < concurrency; i++) {
        next()

        if (isDone || hasError) {
          break
        }
      }

      while (pool.size !== 0) {
        // sync error
        if (hasError) {
          throw error
        }

        await Promise.race(pool.values())

        for (const result of results) {
          yield result
        }

        results = []

        // reject
        if (hasError) {
          throw error
        }
      }
    },
  }
}