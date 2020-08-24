export const toObjectAsync = async <K extends PropertyKey, V>(iterable: AsyncIterable<readonly [K, V]>): Promise<{ [key in K]: V }> => {
  const result = {} as { [key in K]: V }

  for await (const [key, value] of iterable) {
    result[key] = value
  }

  return result
}
