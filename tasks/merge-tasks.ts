import type { TTask } from './types'

export type TMergeTasks = {
  <T, R1>(task1: TTask<T, R1>): TTask<T, R1>,
  <T, R1, R2>(task1: TTask<T, R1>, task2: TTask<T, R2>): TTask<T, R1 | R2>,
  <T, R1, R2, R3>(task1: TTask<T, R1>, task2: TTask<T, R2>, task3: TTask<T, R3>): TTask<T, R1 | R2 | R3>,
  <T, R1, R2, R3, R4>(task1: TTask<T, R1>, task2: TTask<T, R2>, task3: TTask<T, R3>, task4: TTask<T, R4>): TTask<T, R1 | R2 | R3 | R4>,
  <T, R1, R2, R3, R4, R5>(task1: TTask<T, R1>, task2: TTask<T, R2>, task3: TTask<T, R3>, task4: TTask<T, R4>, task5: TTask<T, R5>): TTask<T, R1 | R2 | R3 | R4 | R5>,
}

export const mergeTasks: TMergeTasks = (...tasks: any[]) => async function* (arg: any) {
  const { mergeAsync } = await import('iterama')

  yield* mergeAsync(
    // @ts-ignore we took care of it in overloads above
    ...tasks.map((task) => task(arg))
  )
}
