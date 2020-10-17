import { startWith } from 'iterama'

export const mergeAsync = <T>(iterables: AsyncIterable<AsyncIterable<T>>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    const subIterators = new Map<AsyncIterator<T>, Promise<void>>()
    const mainIterator = iterables[Symbol.asyncIterator]()
    let isMainIteratorDone = false
    let results: T[] = []

    const next = async (iterator: AsyncIterator<T>): Promise<void> => {
      const iteratorResult = await iterator.next()

      if (iteratorResult.done === true) {
        subIterators.delete(iterator)

        return
      }

      results.push(iteratorResult.value)
      subIterators.set(iterator, next(iterator))
    }

    do {
      let raceIterable: Iterable<Promise<void>> = subIterators.values()

      if (!isMainIteratorDone) {
        raceIterable = startWith(
          (async () => {
            const result = await mainIterator.next()

            if (result.done === true) {
              isMainIteratorDone = true

              return
            }

            const subIterator = result.value[Symbol.asyncIterator]()

            subIterators.set(subIterator, next(subIterator))
          })()
        )(raceIterable)
      }

      await Promise.race(raceIterable)

      yield* results

      results = []
    } while (!isMainIteratorDone || subIterators.size > 0)
  },
})
