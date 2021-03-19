import type { TMaybePromise } from './types'

export const piAll = (concurrency: number = Infinity) => <T>(iterable: Iterable<() => TMaybePromise<T>>): AsyncIterable<T> => {
  if ((!Number.isSafeInteger(concurrency) && concurrency !== Infinity) || concurrency < 1) {
    throw new TypeError('`concurrency` argument must be a number >= 1')
  }

  return {
    async *[Symbol.asyncIterator]() {
      const pool = new Set<TMaybePromise<T>>()
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

        let maybePromise: TMaybePromise<T>

        try {
          maybePromise = iteration.value()

          pool.add(maybePromise)

          const result = await maybePromise

          results.push(result)
        } catch (err) {
          hasError = true
          error = err
        } finally {
          pool.delete(maybePromise!)
        }
      }

      for (let i = 0; i < concurrency; i++) {
        void next()

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

          if (!isDone && !hasError) {
            void next()
          }
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
