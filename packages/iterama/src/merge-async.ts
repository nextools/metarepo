import { map } from './map'

type TUnwrap<T> = T extends AsyncIterable<infer U>[] ? U : never

export const mergeAsync = <T extends AsyncIterable<any>[]>(...its: T): AsyncIterable<TUnwrap<T>> => ({
  async *[Symbol.asyncIterator]() {
    const iterators = map((it: AsyncIterable<any>) => it[Symbol.asyncIterator]())(its)
    const queueNext = async (iterator: AsyncIterator<any>) => ({
      iterator,
      result: await iterator.next(),
    })
    const sources = new Map(
      map((iterator: AsyncIterator<any>) => [
        iterator,
        queueNext(iterator),
      ] as const)(iterators)
    )

    try {
      while (sources.size > 0) {
        const winner = await Promise.race(sources.values())

        if (winner.result.done === true) {
          sources.delete(winner.iterator)
        } else {
          const { value } = winner.result

          sources.set(winner.iterator, queueNext(winner.iterator))

          yield value
        }
      }
    } finally {
      await Promise.all(
        map((iterator: AsyncIterator<any>) => iterator.return?.())(iterators)
      )
    }
  },
})
