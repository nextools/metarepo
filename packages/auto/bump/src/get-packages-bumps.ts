import { getCrossDependents, getDependentsCount, getDependentsOf } from '@auto/workspaces'
import {
  compareReleaseTypes,
  TBumpType,
  TPackages,
  TGitBump,
  TPackageBump,
} from '@auto/utils'
import { bumpRange } from './bump-range'
import { bumpVersion } from './bump-version'
import { TBumpOptions } from './types'

export const getPackagesBumps = (packages: TPackages, bumps: TGitBump[], bumpOptions: TBumpOptions): TPackageBump[] => {
  for (const bump of bumps) {
    if (!Reflect.has(packages, bump.name)) {
      throw new Error(`Unable to find package ${bump.name} in packages`)
    }
  }

  const crossDependents = getCrossDependents(packages)
  const bumpStack: { [name: string]: TPackageBump } = {}

  const bumpDependents = (name: string, version: string, prevType: TBumpType | null, type: TBumpType): void => {
    const dependents = getDependentsOf(crossDependents, packages, name)

    if (dependents === null) {
      return
    }

    if (compareReleaseTypes(prevType, type) >= 0) {
      return
    }

    for (const dependent of dependents) {
      const dependentPackage = packages[dependent.name]
      let bumpedRange = null
      let bumpedDevRange = null
      let bumpedVersion = null

      if (dependent.range !== null) {
        // if bumped range is different from the range from stack (existing or not) then bump
        bumpedRange = bumpRange(dependent.range, version, type, bumpOptions)

        // skip dependent if we shouldn't always bump a version and it satisfies the bump
        if (bumpedRange === dependent.range) {
          continue
        }

        bumpedVersion = bumpVersion(dependentPackage.json.version, type, bumpOptions)
      }

      if (dependent.devRange !== null) {
        bumpedDevRange = bumpRange(dependent.devRange, version, type, bumpOptions)

        // skip dependent if we shouldn't always bump a version and it satisfies the bump
        if (bumpedDevRange === dependent.devRange && bumpedVersion === null) {
          continue
        }
      }

      let dependentPrevType: TBumpType | null = null

      if (Reflect.has(bumpStack, dependent.name)) {
        const bumpStackItem = bumpStack[dependent.name]

        dependentPrevType = bumpStackItem.type

        if (bumpedVersion !== null && compareReleaseTypes(bumpStackItem.type, type) < 0) {
          bumpStackItem.version = bumpedVersion
          bumpStackItem.type = type
        }

        if (bumpedRange !== null) {
          bumpStackItem.deps = {
            ...bumpStackItem.deps,
            [name]: bumpedRange,
          }
        }

        if (bumpedDevRange !== null) {
          bumpStackItem.devDeps = {
            ...bumpStackItem.devDeps,
            [name]: bumpedDevRange,
          }
        }
      } else {
        bumpStack[dependent.name] = {
          name: dependent.name,
          dir: dependentPackage.dir,
          version: null,
          type: null,
          deps: null,
          devDeps: null,
        }

        if (bumpedVersion !== null) {
          bumpStack[dependent.name].version = bumpedVersion
          bumpStack[dependent.name].type = type
        }

        if (bumpedRange !== null) {
          bumpStack[dependent.name].deps = {
            ...bumpStack[dependent.name].deps,
            [name]: bumpedRange,
          }
        }

        if (bumpedDevRange !== null) {
          bumpStack[dependent.name].devDeps = {
            ...bumpStack[dependent.name].devDeps,
            [name]: bumpedDevRange,
          }
        }
      }

      if (bumpedVersion !== null) {
        bumpDependents(dependent.name, dependentPackage.json.version, dependentPrevType, type)
      }
    }
  }

  for (const bump of bumps) {
    const packageItem = packages[bump.name]
    let prevType: TBumpType | null = null

    if (Reflect.has(bumpStack, bump.name)) {
      const bumpStackItem = bumpStack[bump.name]

      // if there was already a bump greater or equal than the current
      // then do nothing
      if (compareReleaseTypes(bumpStackItem.type, bump.type) >= 0) {
        continue
      }

      prevType = bumpStackItem.type

      bumpStack[bump.name] = {
        ...bumpStackItem,
        version: bumpVersion(packageItem.json.version, bump.type, bumpOptions),
        type: bump.type,
      }
    } else {
      bumpStack[bump.name] = {
        name: bump.name,
        dir: packageItem.dir,
        version: bumpVersion(packageItem.json.version, bump.type, bumpOptions),
        type: bump.type,
        deps: null,
        devDeps: null,
      }
    }

    bumpDependents(bump.name, packageItem.json.version, prevType, bump.type)
  }

  return Object.values(bumpStack)
    .sort((a, b) => getDependentsCount(a) - getDependentsCount(b))
}
