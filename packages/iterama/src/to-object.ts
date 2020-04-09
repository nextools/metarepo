export const toObject = <K extends PropertyKey, V>(iterable: Iterable<readonly [K, V]>): { [key in K]: V } => {
  const result = {} as { [key in K]: V }

  for (const [key, value] of iterable) {
    result[key] = value
  }

  return result
}
