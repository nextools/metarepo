import { dirname } from 'path'
import fastGlob from 'fast-glob'
import { getPackage } from './get-package'

export const getPackageDirs = async (): Promise<string[]> => {
  const { workspaces } = await getPackage(process.cwd())
  let globs = null

  if (typeof workspaces === 'undefined') {
    throw new Error('`workspaces` field in `package.json` is required')
  }

  if (Array.isArray(workspaces)) {
    globs = workspaces
  } else if (Array.isArray(workspaces.packages)) {
    globs = workspaces.packages
  } else {
    throw new Error('`workspaces.packages` field in `package.json` is required')
  }

  globs = globs.map((glob) => `${glob}/package.json`)

  const files = await fastGlob(globs, {
    onlyDirectories: false,
    onlyFiles: true,
    absolute: true,
  }) as string[]

  return files.map(dirname)
}
