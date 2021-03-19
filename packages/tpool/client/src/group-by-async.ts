export const groupByAsync = (num: number) => <T>(it: AsyncIterable<T>): AsyncIterable<T[]> => ({
  async *[Symbol.asyncIterator]() {
    const iterator = it[Symbol.asyncIterator]()
    let isDone = false
    let buf: T[] = []

    while (!isDone) {
      for (let i = 0; i < num; i++) {
        const result = await iterator.next()

        isDone = result.done === true

        if (isDone) {
          break
        }

        buf.push(result.value)
      }

      if (buf.length > 0) {
        yield buf

        buf = []
      }
    }
  },
})
