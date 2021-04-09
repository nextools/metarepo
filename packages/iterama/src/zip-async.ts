type TUnwrap<T> = T extends AsyncIterable<infer U>[] ? [U] : never

export const zipAsync = <T extends AsyncIterable<any>[]>(...its: T): AsyncIterable<TUnwrap<T>> => {
  return {
    async *[Symbol.asyncIterator]() {
      const iterators = its.map((it) => it[Symbol.asyncIterator]())

      try {
        while (true) {
          const values = await Promise.all(iterators.map((it) => it.next()))

          if (values.some((r) => r.done)) {
            break
          }

          yield values.map((r) => r.value) as any
        }
      } finally {
        await Promise.all(iterators.map((it) => it.return?.()))
      }
    },
  }
}
