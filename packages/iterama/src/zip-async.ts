import { iterateAsync } from './iterate-async'

export function zipAsync <A, B>(it0: AsyncIterable<A>, it1: AsyncIterable<B>): AsyncIterable<[A, B]>
export function zipAsync <A, B, C>(it0: AsyncIterable<A>, it1: AsyncIterable<B>, it2: AsyncIterable<C>): AsyncIterable<[A, B, C]>
export function zipAsync <A, B, C, D>(it0: AsyncIterable<A>, it1: AsyncIterable<B>, it2: AsyncIterable<C>, it3: AsyncIterable<D>): AsyncIterable<[A, B, C, D]>

export function zipAsync(...iterables: AsyncIterable<any>[]) {
  return {
    async *[Symbol.asyncIterator]() {
      const values = Array.from<any>({ length: iterables.length })
      const iterators = iterables.map(iterateAsync)
      let isDone = false

      while (!isDone) {
        for (let i = 0; i < iterables.length; i++) {
          values[i] = await iterators[i].next()
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
