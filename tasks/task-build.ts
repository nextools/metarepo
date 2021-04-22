import type { TTask } from '@start/types'

const isFilePathTS = (filePath: string): boolean => filePath.endsWith('.ts') || filePath.endsWith('.tsx')
const isFilePathDTS = (filePath: string): boolean => filePath.endsWith('.d.ts')

export const build: TTask<string, any> = async function* (pkg) {
  const { join } = await import('path')
  const { isUndefined, objectHas } = await import('tsfn')
  const { readPackageJson } = await import('pkgu')
  const { mergeAsync } = await import('iterama')
  const { buildNode } = await import('./task-build-node')
  const { buildWeb } = await import('./task-build-web')
  const { buildTypes } = await import('./task-build-types')
  const { copyTypes } = await import('./task-copy-types')

  if (isUndefined(pkg)) {
    throw new Error('`package` argument is required')
  }

  const packageDir = join('packages', pkg)
  const packageJson = await readPackageJson(packageDir)
  const tasks = new Set<AsyncIterable<any>>()

  if (objectHas(packageJson, 'main')) {
    tasks.add(buildNode(pkg))

    if (isFilePathTS(packageJson.main)) {
      tasks.add(buildTypes(pkg))
    } else {
      tasks.add(copyTypes(pkg))
    }
  }

  if (objectHas(packageJson, 'browser')) {
    tasks.add(buildWeb(pkg))

    if (isFilePathTS(packageJson.browser)) {
      tasks.add(buildTypes(pkg))
    } else {
      tasks.add(copyTypes(pkg))
    }
  }

  if (objectHas(packageJson, 'types')) {
    if (isFilePathDTS(packageJson.types)) {
      tasks.add(copyTypes(pkg))
    } else {
      tasks.add(buildTypes(pkg))
    }
  }

  yield* mergeAsync(...tasks)
}
