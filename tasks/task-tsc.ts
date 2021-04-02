import type { TTask } from './types'

export const tsc: TTask<any, any> = async function* () {
  const { typescriptCheck } = await import('./plugin-lib-typescript-check')

  yield* typescriptCheck()
}
