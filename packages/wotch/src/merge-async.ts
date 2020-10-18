import { startWith } from 'iterama'

export const mergeAsync = <T>(iterables: AsyncIterable<AsyncIterable<T>>): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    const mainIterator = iterables[Symbol.asyncIterator]()
    const subIteratorsMap = new Map<AsyncIterator<T>, Promise<void>>()
    let isMainIteratorDone = false
    let results: T[] = []

    const next = async (subIterator: AsyncIterator<T>): Promise<void> => {
      const iteratorResult = await subIterator.next()

      if (iteratorResult.done === true) {
        subIteratorsMap.delete(subIterator)

        return
      }

      results.push(iteratorResult.value)
      subIteratorsMap.set(subIterator, next(subIterator))
    }

    const init = async () => {
      const result = await mainIterator.next()

      if (result.done === true) {
        isMainIteratorDone = true

        return
      }

      const subIterator = result.value[Symbol.asyncIterator]()

      subIteratorsMap.set(subIterator, next(subIterator))
    }

    do {
      let raceIterable: Iterable<Promise<void>> = subIteratorsMap.values()

      if (!isMainIteratorDone) {
        raceIterable = startWith(init())(raceIterable)
      }

      await Promise.race(raceIterable)

      yield* results

      results = []
    // eslint-disable-next-line no-unmodified-loop-condition
    } while (!isMainIteratorDone || subIteratorsMap.size > 0)
  },
})
