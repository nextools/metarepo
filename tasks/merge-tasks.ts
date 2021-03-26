import type { TPlugin } from './types'

export const mergeTasks = <T, R1, R2>(task1: TPlugin<T, R1>, task2: TPlugin<T, R2>): TPlugin<T, R1 | R2> => async function* (it) {
  const { broadcastAsync, mergeAsync } = await import('iterama')

  const broadcasted = broadcastAsync(it)
  const it1 = task1(broadcasted)
  const it2 = task2(broadcasted)

  yield* mergeAsync(it1, it2)
}
