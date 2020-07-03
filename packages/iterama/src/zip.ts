export function zip <A, B>(it0: Iterable<A>, it1: Iterable<B>): Iterable<[A, B]>
export function zip <A, B, C>(it0: Iterable<A>, it1: Iterable<B>, it2: Iterable<C>): Iterable<[A, B, C]>
export function zip <A, B, C, D>(it0: Iterable<A>, it1: Iterable<B>, it2: Iterable<C>, it3: Iterable<D>): Iterable<[A, B, C, D]>

export function zip(...iterables: Iterable<any>[]) {
  return {
    *[Symbol.iterator]() {
      const iterators = iterables.map((i) => i[Symbol.iterator]())

      try {
        while (true) {
          const values = iterators.map((i) => i.next())

          if (values.some((v) => v.done)) {
            break
          }

          yield values.map((v) => v.value) as any
        }
      } finally {
        iterators.forEach((i) => i.return?.())
      }
    },
  }
}
