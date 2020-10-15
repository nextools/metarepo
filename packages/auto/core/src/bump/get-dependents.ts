import { isString } from 'tsfn'
import type { TReadonly } from 'tsfn'
import type { TPackageJson, TPackageMap } from '../types'

export const getDependencyRange = ({ dependencies }: TReadonly<TPackageJson>, jsonName: string): string | null =>
  dependencies?.[jsonName] ?? null

export const getDevDependencyRange = ({ devDependencies }: TReadonly<TPackageJson>, jsonName: string): string | null =>
  devDependencies?.[jsonName] ?? null

export const getDependents = (packages: TReadonly<TPackageMap>, pkgName: string): string[] => {
  const result: string[] = []

  for (const dependentName of packages.keys()) {
    const { dependencies, devDependencies } = packages.get(dependentName)!.json

    if (isString(dependencies?.[pkgName] ?? devDependencies?.[pkgName])) {
      result.push(dependentName)
    }
  }

  return result
}
