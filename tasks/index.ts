import type { TFile, TTask } from './types'

export const build: TTask<string, TFile | string> = async function* (pkg: string) {
  const { mergeTasks } = await import('./merge-tasks')
  const { buildNode } = await import('./build-node')
  const { buildWeb } = await import('./build-web')
  const { buildTypes } = await import('./build-types')

  yield* mergeTasks(
    buildNode,
    buildWeb,
    buildTypes
  )(pkg)
}
