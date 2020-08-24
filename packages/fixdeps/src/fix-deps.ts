import path from 'path'
import { writeFile } from 'pifs'
import { composeDependencies } from './compose-dependencies'
import { getDepsToModify } from './get-deps-to-modify'
import { getDepsVersions } from './get-deps-versions'
import { getPackage } from './get-package-json'
import { objectFromEntries } from './object-from-entries'
import type { TOptions, TDepsEntries, TResult } from './types'

export const fixdeps = async (options: TOptions): Promise<TResult> => {
  const {
    depsToAdd,
    depsToRemove,
    devDepsToAdd,
    peerDevDepsToAdd,
  } = await getDepsToModify(options)

  const packageJsonPath = path.join(options.packagePath, 'package.json')
  const packageJson = await getPackage(options.packagePath)

  const depsToAddWithVersions = await getDepsVersions(depsToAdd)
  const devDepsToAddWithVersions = await getDepsVersions(devDepsToAdd)
  const peerDevDepsToAddWithVersions = peerDevDepsToAdd.map((name) => [name, packageJson.peerDependencies![name]]) as TDepsEntries
  const allDevDepsToAddWithVersions = [...devDepsToAddWithVersions, ...peerDevDepsToAddWithVersions]

  const composedDependencies = composeDependencies(packageJson.dependencies, depsToAddWithVersions, depsToRemove)
  const composedDevDependencies = composeDependencies(packageJson.devDependencies, allDevDepsToAddWithVersions, depsToRemove)

  if (Object.keys(composedDependencies).length > 0) {
    packageJson.dependencies = composedDependencies
  } else {
    Reflect.deleteProperty(packageJson, 'dependencies')
  }

  if (Object.keys(composedDevDependencies).length > 0) {
    packageJson.devDependencies = composedDevDependencies
  } else {
    Reflect.deleteProperty(packageJson, 'devDependencies')
  }

  if (depsToRemove.length > 0 || depsToAddWithVersions.length > 0 || allDevDepsToAddWithVersions.length > 0) {
    const packageData = `${JSON.stringify(packageJson, null, 2)}\n`

    await writeFile(packageJsonPath, packageData)

    return {
      addedDeps: objectFromEntries(depsToAddWithVersions),
      addedDevDeps: objectFromEntries(allDevDepsToAddWithVersions),
      removedDeps: depsToRemove,
    }
  }

  return null
}
