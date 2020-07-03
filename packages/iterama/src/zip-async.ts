export function zipAsync <A, B>(it0: AsyncIterable<A>, it1: AsyncIterable<B>): AsyncIterable<[A, B]>
export function zipAsync <A, B, C>(it0: AsyncIterable<A>, it1: AsyncIterable<B>, it2: AsyncIterable<C>): AsyncIterable<[A, B, C]>
export function zipAsync <A, B, C, D>(it0: AsyncIterable<A>, it1: AsyncIterable<B>, it2: AsyncIterable<C>, it3: AsyncIterable<D>): AsyncIterable<[A, B, C, D]>

export function zipAsync(...iterables: AsyncIterable<any>[]) {
  return {
    async *[Symbol.asyncIterator]() {
      const iterators = iterables.map((i) => i[Symbol.asyncIterator]())

      try {
        while (true) {
          const values = await Promise.all(iterators.map((i) => i.next()))

          if (values.some((v) => v.done)) {
            break
          }

          yield values.map((v) => v.value) as any
        }
      } finally {
        await Promise.all(iterators.map((i) => i.return?.()))
      }
    },
  }
}
