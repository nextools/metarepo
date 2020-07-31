import type { TFulfilled, TRejected, TMaybePromise } from './types'

export const piAllSettled = <T>(iterable: Iterable<() => TMaybePromise<T>>, concurrency: number = Infinity): AsyncIterable<TFulfilled<T> | TRejected> => {
  if ((!Number.isSafeInteger(concurrency) && concurrency !== Infinity) || concurrency < 1) {
    throw new TypeError('`concurrency` argument must be a number >= 1')
  }

  return {
    async *[Symbol.asyncIterator]() {
      const pool = new Set<TMaybePromise<T>>()
      const iterator = iterable[Symbol.iterator]()
      let results = [] as (TFulfilled<T> | TRejected)[]
      let isDone = false

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

          results.push({ status: 'fulfilled', value: result })
        } catch (error) {
          results.push({ status: 'rejected', reason: error })
        } finally {
          pool.delete(maybePromise!)

          if (!isDone) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            next()
          }
        }
      }

      for (let i = 0; i < concurrency; i++) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        next()

        if (isDone) {
          break
        }
      }

      while (pool.size !== 0) {
        try {
          await Promise.race(pool.values())
        } catch {
          // ignore, it's in `results` already
        } finally {
          for (const result of results) {
            yield result
          }

          results = []
        }
      }
    },
  }
}
