import { pipe } from 'funcom'
import { concatAsync, filter, map } from 'iterama'
import { isArray, isString } from 'tsfn'
import { isMatchingGlob, isNegatedGlob } from './glob-utils'
import { matchGlob } from './match-glob'

export const matchGlobs = (globs: string | string[]): AsyncIterable<string> => {
  if (isString(globs)) {
    return matchGlob([])(globs)
  }

  if (isArray(globs)) {
    const negatedGlobs = filter(isNegatedGlob)(globs)

    const matchingPaths = pipe(
      filter(isMatchingGlob),
      map(matchGlob(negatedGlobs))
    )(globs)

    return concatAsync<AsyncIterable<string>[]>(...matchingPaths)
  }

  throw new Error('Globs argument should be either string or array of strings')
}
