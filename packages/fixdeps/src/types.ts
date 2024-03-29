export type TDepsEntries = [string, string][]

export type TDepsObject = {[k: string]: string}

export type TOptions = {
  packagePath: string,
  dependenciesGlobs: string[],
  devDependenciesGlobs: string[],
  ignoredPackages?: string[],
}

export type TPackageJson = {
  name: string,
  version: string,
  dependencies?: {
    [k: string]: string,
  },
  devDependencies?: {
    [k: string]: string,
  },
  peerDependencies?: {
    [k: string]: string,
  },
  fixdeps?: {
    ignoredPackages?: string[],
    dependenciesGlobs?: string[],
    devDependenciesGlobs?: string[],
  },
}

export type TGetDepsToModifyResult = {
  depsToAdd: string[],
  depsToRemove: string[],
  devDepsToAdd: string[],
  peerDevDepsToAdd: string[],
}

export type TResult = {
  addedDeps: TDepsObject,
  addedDevDeps: TDepsObject,
  removedDeps: string[],
} | null
