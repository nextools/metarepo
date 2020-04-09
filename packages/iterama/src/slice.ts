import { pipe } from '@psxcode/compose'
import { skip } from './skip'
import { take } from './take'

type TReturnIterable<T> = (iterable: Iterable<T>) => Iterable<T>

export const slice = (from: number = 0, to: number = Number.MAX_SAFE_INTEGER) => <T>(iterable: Iterable<T>): Iterable<T> =>
  pipe(
    from < 0
      ? take(from) as TReturnIterable<T>
      : skip(from) as TReturnIterable<T>,
    to < 0
      ? skip(to) as TReturnIterable<T>
      : take(to) as TReturnIterable<T>
  )(iterable)
