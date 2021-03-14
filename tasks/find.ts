import { matchGlobs } from 'iva'

export const find = (globs: string[]): AsyncIterable<string> => {
  return matchGlobs(globs)
}
