type TUnwrap<T> = T extends Iterable<infer U>[] ? U : never

export const concat = <T extends Iterable<any>[]>(...its: T): Iterable<TUnwrap<T>> => ({
  *[Symbol.iterator]() {
    for (const it of its) {
      yield* it
    }
  },
})
