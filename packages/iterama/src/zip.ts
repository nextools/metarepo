import { iterate } from './iterate'

export function zip <A, B>(it0: Iterable<A>, it1: Iterable<B>): Iterable<[A, B]>
export function zip <A, B, C>(it0: Iterable<A>, it1: Iterable<B>, it2: Iterable<C>): Iterable<[A, B, C]>
export function zip <A, B, C, D>(it0: Iterable<A>, it1: Iterable<B>, it2: Iterable<C>, it3: Iterable<D>): Iterable<[A, B, C, D]>

export function zip(...iterables: Iterable<any>[]) {
  return {
    *[Symbol.iterator]() {
      const values = Array.from<any>({ length: iterables.length })
      const iterators = iterables.map(iterate)
      let isDone = false

      while (!isDone) {
        for (let i = 0; i < iterables.length; i++) {
          values[i] = iterators[i].next()
        }

        for (let i = 0; i < iterables.length; i++) {
          if (values[i].done) {
            isDone = true

            break
          }
        }

        if (!isDone) {
          yield values.map((v) => v.value) as any
        }
      }
    },
  }
}
