export type TReduceFn<T, R> = (acc: R, value: T, index: number) => R

export const reduce = <T, R>(reduceFn: TReduceFn<T, R>, initial: R) => (iterable: Iterable<T>): R => {
  let state = initial
  let i = 0

  for (const value of iterable) {
    state = reduceFn(state, value, i++)
  }

  return state
}

