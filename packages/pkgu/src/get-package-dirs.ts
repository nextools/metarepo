import path from 'path'
import fastGlob from 'fast-glob'
import { isArray, isUndefined } from 'tsfn'
import { readPackageJson } from './read-package-json'

export const getPackageDirs = async (): Promise<Set<string>> => {
  const { workspaces } = await readPackageJson(process.cwd())

  if (isUndefined(workspaces)) {
    throw new Error('Cannot find `workspaces` field in the root `package.json`')
  }

  let globs: string[]

  if (isArray(workspaces)) {
    globs = workspaces
  } else if (isArray(workspaces.packages)) {
    globs = workspaces.packages
  } else {
    throw new Error('Cannot find `workspaces.packages` field in the root `package.json`')
  }

  globs = globs.map((glob) => `${glob}/package.json`)

  const files = await fastGlob(globs, {
    onlyDirectories: false,
    onlyFiles: true,
    absolute: true,
  })

  return new Set(
    files.map(path.dirname)
  )
}
