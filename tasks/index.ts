import type { TFile, TTask } from './types'

export const build: TTask<string, TFile | string> = async function* (pkg: string) {
  const { mergeAsync } = await import('iterama')
  const { buildNode } = await import('./build-node')
  const { buildWeb } = await import('./build-web')
  const { buildTypes } = await import('./build-types')

  yield* mergeAsync(
    buildNode(pkg),
    buildWeb(pkg),
    buildTypes(pkg)
  )
}
