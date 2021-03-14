export const find = (globs: string[]) => async (): Promise<AsyncIterable<string>> => {
  const { matchGlobs } = await import('iva')

  return matchGlobs(globs)
}
