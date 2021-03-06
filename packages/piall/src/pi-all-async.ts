import type { TMaybePromise } from './types'

export const piAllAsync = <T>(iterable: AsyncIterable<() => TMaybePromise<T>>, concurrency: number = Infinity): AsyncIterable<T> => {
  if ((!Number.isSafeInteger(concurrency) && concurrency !== Infinity) || concurrency < 1) {
    throw new TypeError('`concurrency` argument must be a number >= 1')
  }

  return {
    async *[Symbol.asyncIterator]() {
      const pool = new Set<TMaybePromise<T>>()
      const iterator = iterable[Symbol.asyncIterator]()
      const results = [] as T[]
      let resolveYieldPromise = null as ((value: T) => void) | null
      let rejectYieldPromise = null as ((reason: any) => void) | null
      let hasError = false
      let error
      let isNextDone = false
      let isNextStuck = false

      const run = async (maybePromise: TMaybePromise<T>): Promise<void> => {
        try {
          pool.add(maybePromise)

          const result = await maybePromise

          pool.delete(maybePromise)

          // yield doesn't wait for promise to be resolved
          if (resolveYieldPromise === null) {
            // push to results for future yield
            results.push(result)

            return
          }

          // clear resolver and rejecter for possible further run() calls
          const _resolve = resolveYieldPromise

          resolveYieldPromise = null
          rejectYieldPromise = null

          // resolve yield promise
          _resolve(result)
        } catch (err) {
          pool.delete(maybePromise)

          if (rejectYieldPromise === null) {
            hasError = true
            error = err
          } else {
            rejectYieldPromise(err)
          }
        }
      }

      const next = async (): Promise<void> => {
        if (isNextDone || hasError) {
          return
        }

        isNextStuck = false

        try {
          const iteration = await iterator.next()

          if (iteration.done === true) {
            isNextDone = true

            return
          }

          // resolve value promise and push result(s)
          void run(iteration.value())

          // should next() call itself one again or not
          if (pool.size < concurrency) {
            void next()
          } else {
            isNextStuck = true
          }
        } catch (err) {
          // yield doesn't wait for promise to be rejected
          if (rejectYieldPromise === null) {
            hasError = true
            error = err
          // or reject it directly
          } else {
            rejectYieldPromise(err)
          }
        }
      }

      // first next() to start iterating
      void next()

      // eslint-disable-next-line no-unmodified-loop-condition
      while (!isNextDone || pool.size > 0 || results.length > 0) {
        // sync error
        if (hasError) {
          throw error
        }

        // eslint-disable-next-line no-loop-func
        yield new Promise<T>((resolve, reject) => {
          // if there is a result already – return it directly
          if (results.length > 0) {
            // give the result
            resolve(results.shift() as T)

            return
          }

          // no result at the moment – store resolver and rejecter
          resolveYieldPromise = resolve
          rejectYieldPromise = reject
        })

        // call next() once again because it has stuck to concurrency limit since the last yield
        if (isNextStuck) {
          void next()
        }

        // reject
        if (hasError) {
          throw error
        }
      }
    },
  }
}

export const main = async () => {
  const sec = (i: number) => () => new Promise<string>((resolve) => {
    setTimeout(() => resolve(`tick ${i}`), i === 3 ? 1000 : 1000)
  })

  const it = {
    async *[Symbol.asyncIterator]() {
      await Promise.resolve()
      yield sec(1)
      await Promise.resolve()
      yield sec(2)
      await Promise.resolve()
      yield sec(3)
      await Promise.resolve()
      yield sec(4)
      await Promise.resolve()
      yield sec(5)
      await Promise.resolve()
      yield sec(6)
    },
  }

  const pit = piAllAsync(it, 2)

  for await (const i of pit) {
    console.log(i)
  }
}
