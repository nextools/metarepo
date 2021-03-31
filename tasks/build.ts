import type { TTask } from './types'

export const build: TTask<string, any> = async function* (pkg) {
  const { mergeTasks } = await import('./merge-tasks')
  const { buildNode } = await import('./build-node')
  const { buildWeb } = await import('./build-web')
  const { buildTypes } = await import('./build-types')

  yield* mergeTasks(
    buildTypes,
    buildNode,
    buildWeb
  )(pkg)
}
