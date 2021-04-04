import type { TTask } from './types'

export const build: TTask<string, any> = async function* (pkg) {
  const { mergeAsync } = await import('iterama')
  const { buildNode } = await import('./task-build-node')
  const { buildWeb } = await import('./task-build-web')
  // const { buildTypes } = await import('./task-build-types')

  yield* mergeAsync(
    buildNode(pkg),
    buildWeb(pkg)
    // buildTypes(pkg)
  )
}
