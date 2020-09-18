import { concat } from 'iterama'
import { iterateObjectEntries } from 'itobj'
import { getPackages } from 'pkgu'
import { intersects } from 'semver'
import type { TDepsMap, TDuplicatedDependencies } from './types'

export const getDuplicatedDependencies = async (): Promise<TDuplicatedDependencies> => {
  const packages = await getPackages()
  const depsMap: TDepsMap = new Map()
  const result: TDuplicatedDependencies = new Map()

  for (const [pkgName, value] of packages) {
    const pkgDeps = iterateObjectEntries(value.json.dependencies ?? {})
    const pkgDevDeps = iterateObjectEntries(value.json.devDependencies ?? {})
    const pkgAllDeps = concat(pkgDeps, pkgDevDeps)

    for (const [depName, depRange] of pkgAllDeps) {
      if (!depsMap.has(depName)) {
        depsMap.set(depName, new Set())
      }

      depsMap.get(depName)!.add({
        pkgName,
        range: depRange,
      })
    }
  }

  for (const [depName, dependents] of depsMap) {
    for (const dependentA of dependents) {
      for (const dependentB of dependents) {
        if (dependentA === dependentB) {
          continue
        }

        if (!intersects(dependentA.range, dependentB.range)) {
          if (!result.has(dependentA.pkgName)) {
            result.set(dependentA.pkgName, new Map())
          }

          if (!result.get(dependentA.pkgName)!.has(depName)) {
            result.get(dependentA.pkgName)!.set(depName, {
              range: dependentA.range,
              dependents: new Set(),
            })
          }

          result.get(dependentA.pkgName)!.get(depName)!.dependents.add({
            pkgName: dependentB.pkgName,
            range: dependentB.range,
          })
        }
      }
    }
  }

  return result
}
