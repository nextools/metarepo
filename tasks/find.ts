export const find = async (globs: string[]): Promise<AsyncIterable<string>> => {
  const { matchGlobs } = await import('iva')

  return matchGlobs(globs)
}
