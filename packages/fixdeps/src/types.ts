import { TJsonMap } from 'typeon'

export type TDepsEntries = [string, string][]

export type TDepsObject = {[k: string]: string}

export type TOptions = {
  packagePath: string,
  dependencyFilesGlobs: string[],
  devDependencyFilesGlobs: string[],
  ignoredPackages?: string[],
}

export type TPackageJson = {
  dependencies?: {
    [k: string]: string,
  },
  devDependencies?: {
    [k: string]: string,
  },
  peerDependencies?: {
    [k: string]: string,
  },
} & TJsonMap

export type TResult = {
  addedDeps: TDepsObject,
  addedDevDeps: TDepsObject,
  removedDeps: string[],
} | null
