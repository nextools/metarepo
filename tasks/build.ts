import type { TTask } from './types'

export const build: TTask<string, any> = async function* (pkg) {
  const { mergeAsync } = await import('iterama')
  const { all } = await import('funcom')
  const { buildNode } = await import('./build-node')
  const { buildWeb } = await import('./build-web')
  const { buildTypes } = await import('./build-types')

  yield* mergeAsync(
    ...all(
      buildNode,
      buildWeb,
      buildTypes
    )(pkg)
  )
}
