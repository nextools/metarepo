export const toArrayAsync = async <T>(iterable: AsyncIterable<T>): Promise<T[]> => {
  const result: T[] = []

  for await (const value of iterable) {
    result.push(value)
  }

  return result
}
