import path from 'path'
import fastGlob from 'fast-glob'
import { readPackage } from './read-package'

export const getPackageDirs = async (): Promise<string[]> => {
  const { workspaces } = await readPackage(process.cwd())

  if (typeof workspaces === 'undefined') {
    throw new Error('Cannot find "workspaces" field in "package.json"')
  }

  let globs: string[]

  if (Array.isArray(workspaces)) {
    globs = workspaces
  } else if (Array.isArray(workspaces.packages)) {
    globs = workspaces.packages
  } else {
    throw new Error('Cannot find "workspaces.packages" field in "package.json"')
  }

  globs = globs.map((glob) => `${glob}/package.json`)

  const files: string[] = await fastGlob(globs, {
    onlyDirectories: false,
    onlyFiles: true,
    absolute: true,
  })

  return files.map(path.dirname)
}
