import { pipe } from 'funcom'
import { mergeAsync, filter, map } from 'iterama'
import { isArray, isString } from 'tsfn'
import { isMatchingGlob, isNegatedGlob } from './glob-utils'
import { watchGlob } from './watch-glob'

const watch = (globs: string | string[]): AsyncIterable<string> => {
  if (isString(globs)) {
    return watchGlob([])(globs)
  }

  if (isArray(globs)) {
    const negatedGlobs = filter(isNegatedGlob)(globs)

    const matchingPaths = pipe(
      filter(isMatchingGlob),
      map(watchGlob(negatedGlobs))
    )(globs)

    return mergeAsync<AsyncIterable<string>[]>(...matchingPaths)
  }

  throw new Error('Globs argument should be either string or array of strings')
}

const globs = [
  'tmp/watch/**/*.txt',
  '!tmp/watch/not/**',
]

for await (const path of watch(globs)) {
  console.log(path)
}
