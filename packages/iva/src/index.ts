import { cwd } from 'process'
import { pipe } from 'funcom'
import { concatAsync, filter, map, uniqueAsync } from 'iterama'
import toAbsoluteGlob from 'to-absolute-glob'
import { matchGlob } from './match-glob'

export const matchGlobs = (globs: Iterable<string>): AsyncIterable<string> => {
  const workingDirPath = cwd()

  const negatedGlobs = pipe(
    filter<string>((glob) => glob.charAt(0) === '!' && glob.charAt(1) !== '('),
    map((glob) => toAbsoluteGlob(glob, { cwd: workingDirPath }))
  )(globs)

  const matchingGlobs = pipe(
    filter<string>((glob) => glob.charAt(0) !== '!'),
    map((glob) => matchGlob(glob, negatedGlobs, workingDirPath))
  )(globs)

  return pipe(
    concatAsync,
    uniqueAsync
  )(matchingGlobs)
}
