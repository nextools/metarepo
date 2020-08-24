import semver from 'semver'
import type { TReadonly } from 'tsfn'
import type { TPackageMap, TReleaseType, TBumpConfig, TGitMessageMap, TPromptEditData } from '../types'
import { compareReleaseTypes, getMostSignificantBumpType, makeEmptyEditData } from '../utils'
import { bumpRange } from './bump-range'
import { bumpVersion } from './bump-version'
import { compileBumpConfig } from './compile-bump-config'
import { getDependents, getDependencyRange, getDevDependencyRange } from './get-dependents'
import { resolveReleaseType } from './resolve-release-type'
import type { TPackageBump, TPackageBumpMap } from './types'

type TGetPackagesBumps = {
  packages: TReadonly<TPackageMap>,
  bumps: TReadonly<TGitMessageMap>,
  edit?: TReadonly<TPromptEditData>,
  config?: TBumpConfig,
}

export const getPackagesBumps = ({ packages, bumps, config, edit = makeEmptyEditData() }: TGetPackagesBumps): TPackageBumpMap => {
  const bumpStack: TPackageBumpMap = new Map()

  const bumpDependents = (pkgName: string, pkgNewVersion: string, pkgType: TReleaseType): void => {
    const pkg = packages.get(pkgName)!
    const pkgJsonName = pkg.json.name
    const dependentsNames = getDependents(packages, pkgJsonName)

    if (dependentsNames.length === 0) {
      return
    }

    const pkgConfig = compileBumpConfig(config, pkg.json.auto?.bump)

    for (const dependentName of dependentsNames) {
      const dependentPackage = packages.get(dependentName)!
      const depRange = getDependencyRange(dependentPackage.json, pkgJsonName)
      const depDevRange = getDevDependencyRange(dependentPackage.json, pkgJsonName)
      let bumpedRange: string | null = null
      let bumpedDevRange: string | null = null
      let bumpedVersion: string | null = null
      let shouldBumpDependencts = false

      if (depRange !== null) {
        const isIgnoredByEdit = Boolean(edit.dependencyBumpIgnoreMap.get(dependentName)?.includes(pkgName))
        const shouldBumpThisDep = !semver.satisfies(pkgNewVersion, depRange) || pkgConfig.shouldAlwaysBumpDependents

        bumpedRange = bumpRange(depRange, pkgNewVersion, pkgType)

        if (pkgType !== 'initial' && shouldBumpThisDep && !isIgnoredByEdit) {
          const bumpedType = resolveReleaseType(dependentPackage.json.version, pkgType, dependentName, edit)

          bumpedVersion = bumpVersion(dependentPackage.json.version, bumpedType)
        }
      }

      if (depDevRange !== null) {
        bumpedDevRange = bumpRange(depDevRange, pkgNewVersion, pkgType)
      }

      if (bumpStack.has(dependentName)) {
        const bumpStackItem = bumpStack.get(dependentName)!

        if (bumpedRange !== null) {
          bumpStackItem.deps = {
            ...bumpStackItem.deps,
            [pkgName]: bumpedRange,
          }
        }

        if (bumpedDevRange !== null) {
          bumpStackItem.devDeps = {
            ...bumpStackItem.devDeps,
            [pkgName]: bumpedDevRange,
          }
        }

        if (bumpedVersion !== null && compareReleaseTypes(bumpStackItem.type, pkgType) < 0) {
          bumpStackItem.version = bumpedVersion
          bumpStackItem.type = pkgType
          shouldBumpDependencts = true
        }
      } else {
        const bumpStackItem: TPackageBump = {
          version: null,
          type: null,
          deps: null,
          devDeps: null,
        }

        if (bumpedRange !== null) {
          bumpStackItem.deps = {
            [pkgName]: bumpedRange,
          }
        }

        if (bumpedDevRange !== null) {
          bumpStackItem.devDeps = {
            [pkgName]: bumpedDevRange,
          }
        }

        if (bumpedVersion !== null) {
          bumpStackItem.version = bumpedVersion
          bumpStackItem.type = pkgType
          shouldBumpDependencts = true
        }

        bumpStack.set(dependentName, bumpStackItem)
      }

      if (bumpedVersion !== null && shouldBumpDependencts) {
        bumpDependents(dependentName, bumpedVersion, pkgType)
      }
    }
  }

  for (const [name, bump] of bumps) {
    const { json } = packages.get(name)!
    const releaseType = getMostSignificantBumpType(bump)
    const resolvedType = resolveReleaseType(json.version, releaseType, name, edit)
    const version = bumpVersion(json.version, resolvedType)

    bumpStack.set(name, {
      version,
      type: releaseType,
      deps: null,
      devDeps: null,
    })
  }

  for (const [name, bump] of [...bumpStack]) {
    bumpDependents(name, bump.version!, bump.type!)
  }

  return bumpStack
}
