import type { TReadonly } from 'tsfn'
import type { TPackageBumpMap } from '../bump/types'
import type { TPackageMap, TPackageRelease, TGitMessageMap } from '../types'
import { getDependentsCount } from './get-dependents-count'
import { removeAutoNamePrefix } from './remove-auto-name-prefix'

export const compilePackageReleases = (packages: TReadonly<TPackageMap>, packageBumps: TReadonly<TPackageBumpMap>, gitBumps: TReadonly<TGitMessageMap>): TReadonly<TPackageRelease[]> => {
  const result: TReadonly<TPackageRelease>[] = []

  for (const [name, { type, version, deps, devDeps }] of packageBumps) {
    const { dir, json } = packages.get(name)!
    const messages = gitBumps.get(name) ?? null

    result.push({
      name: removeAutoNamePrefix(name),
      type,
      version,
      dir,
      json,
      deps,
      devDeps,
      messages,
    })
  }

  result.sort((a, b) => getDependentsCount(a) - getDependentsCount(b))

  return result
}
