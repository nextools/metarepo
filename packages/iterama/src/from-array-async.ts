export type TLazyPromise<T> = () => Promise<T>

export const fromArrayAsync = <T>(lazyPromises: TLazyPromise<T>[]): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    for (const lazyPromise of lazyPromises) {
      yield lazyPromise()
    }
  },
})
