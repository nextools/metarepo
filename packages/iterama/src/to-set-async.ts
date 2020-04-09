export const toSetAsync = async <T>(iterable: AsyncIterable<T>): Promise<Set<T>> => {
  const result = new Set<T>()

  for await (const value of iterable) {
    result.add(value)
  }

  return result
}
