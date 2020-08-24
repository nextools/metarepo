export const toMapAsync = async <K, V>(iterable: AsyncIterable<readonly [K, V]>): Promise<Map<K, V>> => {
  const result = new Map<K, V>()

  for await (const [key, value] of iterable) {
    result.set(key, value)
  }

  return result
}
