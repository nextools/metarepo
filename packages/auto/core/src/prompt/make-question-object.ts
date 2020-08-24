import semver from 'semver'
import { isUndefined } from 'tsfn'
import type { TReadonly } from 'tsfn'
import type { TPackageBumpMap } from '../bump/types'
import type { TPromptEditData, TPackageMap, TResolvedReleaseType } from '../types'
import { isResolvedReleaseType } from '../utils'
import type { TQuestionObj } from './types'

export const makeQuestionObject = (packages: TReadonly<TPackageMap>, bumps: TReadonly<TPackageBumpMap>, { dependencyBumpIgnoreMap, initialTypeOverrideMap, zeroBreakingTypeOverrideMap }: TReadonly<TPromptEditData>): TQuestionObj => {
  const result: TQuestionObj = {}

  // INITIAL TYPES
  for (const [name, bump] of bumps) {
    if (bump.type === 'initial') {
      if (isUndefined(result.initialTypes)) {
        result.initialTypes = {}
      }

      result.initialTypes[name] = initialTypeOverrideMap.get(name) ?? 'minor'
    }
  }

  // ZERO BREAKING TYPE
  for (const [name, bump] of bumps) {
    if (bump.type === 'major' && packages.get(name)!.json.version.startsWith('0')) {
      if (isUndefined(result.zeroBreakingTypes)) {
        result.zeroBreakingTypes = {}
      }

      result.zeroBreakingTypes[name] = zeroBreakingTypeOverrideMap.get(name) ?? 'minor'
    }
  }

  // DEPENDECY BUMPS
  for (const [name, bump] of bumps) {
    if (bump.deps !== null && isResolvedReleaseType(bump.type)) {
      const alreadyIgnoredNames = dependencyBumpIgnoreMap.get(name) ?? []
      const { json } = packages.get(name)!
      const depBumps: { [name: string]: TResolvedReleaseType } = {}

      for (const depName of Object.keys(bump.deps)) {
        if (alreadyIgnoredNames.includes(depName)) {
          continue
        }

        const { type, version } = bumps.get(depName)!

        if (isResolvedReleaseType(type) && version !== null && !semver.satisfies(version, json.dependencies![depName])) {
          depBumps[depName] = type
        }
      }

      if (Object.keys(depBumps).length > 0) {
        if (isUndefined(result.dependencyBumps)) {
          result.dependencyBumps = {}
        }

        result.dependencyBumps[name] = depBumps
      }
    }
  }

  return result
}
