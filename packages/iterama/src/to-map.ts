export const toMap = <K, V>(iterable: Iterable<readonly [K, V]>): Map<K, V> => {
  const result = new Map<K, V>()

  for (const [key, value] of iterable) {
    result.set(key, value)
  }

  return result
}
