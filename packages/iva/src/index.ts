import { cwd } from 'process'
import { pipe } from 'funcom'
import { concatAsync, filter, map, uniqueAsync } from 'iterama'
import toAbsoluteGlob from 'to-absolute-glob'
import { isArray } from 'tsfn'
import { matchGlob } from './match-glob'

export const matchGlobs = (globs: string[]): AsyncIterable<string> => {
  if (!isArray(globs)) {
    throw new Error('Array of globs is required')
  }

  const workingDirPath = cwd()

  const negatedGlobs = pipe(
    filter<string>((glob) => glob.charAt(0) === '!' && glob.charAt(1) !== '('),
    map((glob) => toAbsoluteGlob(glob, { cwd: workingDirPath }))
  )(globs)

  const matchingGlobs = pipe(
    filter<string>((glob) => glob.charAt(0) !== '!'),
    map((glob) => matchGlob(glob, negatedGlobs, workingDirPath))
  )(globs)

  // @ts-expect-error
  return uniqueAsync(concatAsync(...matchingGlobs))
}
