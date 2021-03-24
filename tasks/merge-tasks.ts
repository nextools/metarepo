import type { TTask } from './types'

export const mergeTasks = <T, R1, R2>(task1: TTask<T, R1>, task2: TTask<T, R2>): TTask<T, R1 | R2> => async function *(it) {
  const { broadcastAsync, mergeAsync } = await import('iterama')

  const broadcasted = broadcastAsync(it)
  const it1 = task1(broadcasted)
  const it2 = task2(broadcasted)

  yield* mergeAsync(it1, it2)
}
