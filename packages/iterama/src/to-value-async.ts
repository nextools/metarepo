export const toValueAsync = async <T>(iterable: AsyncIterable<T>): Promise<T | undefined> => {
  for await (const value of iterable) {
    return value
  }
}
