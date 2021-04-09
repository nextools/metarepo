type TUnwrap<T> = T extends AsyncIterable<infer U>[] ? U : never

export const concatAsync = <T extends AsyncIterable<any>[]>(...its: T): AsyncIterable<TUnwrap<T>> => ({
  async *[Symbol.asyncIterator]() {
    for await (const it of its) {
      yield* it
    }
  },
})
