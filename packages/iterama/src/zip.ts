type TUnwrap<T> = T extends Iterable<infer U>[] ? [U] : never

export const zip = <T extends Iterable<any>[]>(...its: T): Iterable<TUnwrap<T>> => {
  return {
    *[Symbol.iterator]() {
      const iterators = its.map((it) => it[Symbol.iterator]())

      try {
        while (true) {
          const values = iterators.map((it) => it.next())

          if (values.some((r) => r.done)) {
            break
          }

          yield values.map((r) => r.value) as any
        }
      } finally {
        iterators.forEach((it) => it.return?.())
      }
    },
  }
}
