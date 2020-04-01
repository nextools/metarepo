import { pipe } from '@psxcode/compose'
import { skip } from './skip'
import { take } from './take'
import { fi } from './types'

export const slice = (from: number = 0, to: number = Number.MAX_SAFE_INTEGER) =>
  <T> (it: Iterable<T>): Iterable<T> =>
    pipe(
      from < 0
        ? take(from) as fi<T>
        : skip(from) as fi<T>,
      to < 0
        ? skip(to) as fi<T>
        : take(to) as fi<T>
    )(it)
