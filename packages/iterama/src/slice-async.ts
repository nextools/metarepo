import { pipe } from '@psxcode/compose'
import { takeAsync } from './take-async'
import { skipAsync } from './skip-async'

type TReturnAsyncIterable<T> = (iterable: AsyncIterable<T>) => AsyncIterable<T>

export const sliceAsync = (from: number = 0, to: number = Number.MAX_SAFE_INTEGER) => <T>(iterable: AsyncIterable<T>): AsyncIterable<T> =>
  pipe(
    from < 0
      ? takeAsync(from) as TReturnAsyncIterable<T>
      : skipAsync(from) as TReturnAsyncIterable<T>,
    to < 0
      ? skipAsync(to) as TReturnAsyncIterable<T>
      : takeAsync(to) as TReturnAsyncIterable<T>
  )(iterable)
