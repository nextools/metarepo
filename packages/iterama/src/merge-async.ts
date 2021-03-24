// type UnwrapAsyncIterable<T> = T extends AsyncIterable<infer U>[] ? UnwrapAsyncIterable<U> : T

export type TMergeAsync = {
  <A>(itA: AsyncIterable<A>): AsyncIterable<A>,
  <A, B>(itA: AsyncIterable<A>, itB: AsyncIterable<B>): AsyncIterable<A | B>,
  <A, B, C>(itA: AsyncIterable<A>, itB: AsyncIterable<B>, itC: AsyncIterable<C>): AsyncIterable<A | B | C>,
  <A, B, C, D>(itA: AsyncIterable<A>, itB: AsyncIterable<B>, itC: AsyncIterable<C>, itD: AsyncIterable<D>): AsyncIterable<A | B | C | D>,
  <A, B, C, D, E>(itA: AsyncIterable<A>, itB: AsyncIterable<B>, itC: AsyncIterable<C>, itD: AsyncIterable<D>, itE: AsyncIterable<E>): AsyncIterable<A | B | C | D | E>,
}

export const mergeAsync: TMergeAsync = (...its: AsyncIterable<any>[]) => ({
  async *[Symbol.asyncIterator]() {
    const iterators = its.map((it) => it[Symbol.asyncIterator]())
    const queueNext = async (iterator: AsyncIterator<any>) => ({
      iterator,
      result: await iterator.next(),
    })
    const sources = new Map(
      iterators.map((iterator) => [
        iterator,
        queueNext(iterator),
      ])
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
        iterators.map((iterator) => iterator.return?.())
      )
    }
  },
})
