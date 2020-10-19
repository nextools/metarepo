import { pipe } from 'funcom'
import { mapAsync } from 'iterama'
import { matchGlobs } from 'iva'
import { mergeAsync } from './merge-async'
import type { TWatchPathResult } from './types'
import { watchPath } from './watch-path'

export const main = async () => {
  const res = pipe(
    mapAsync<string, AsyncIterable<TWatchPathResult>>((p) => watchPath(p)),
    mergeAsync
  )(matchGlobs(['packages/nocean/*.md']))

  for await (const r of res) {
    console.log(r)
  }
}
