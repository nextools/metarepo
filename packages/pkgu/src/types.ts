import type { TStringObject } from 'tsfn'

export type TPerson = string | {
  name: string,
  email: string,
  url?: string,
}

// https://docs.npmjs.com/files/package.json
export type TPackageJson = {
  name: string,
  version: string,
  description?: string,
  keywords?: string[],
  homepage?: string,
  license?: string,
  author?: TPerson,
  contributors?: TPerson[],
  files?: string[],
  type?: 'commonjs' | 'module',
  exports?: TStringObject,
  main?: string,
  browser?: string,
  'react-native'?: string,
  types?: string,
  man?: string,
  bin?: string | TStringObject,
  bugs?: string | {
    url: string,
    email?: string,
  },
  repository?: string | {
    type: string,
    url: string,
  },
  directories?: TStringObject,
  scripts?: TStringObject,
  config?: TStringObject,
  dependencies?: TStringObject,
  devDependencies?: TStringObject,
  peerDependencies?: TStringObject,
  bundlesDependencies?: TStringObject,
  optionalDependencies?: TStringObject,
  engines?: {
    node?: string,
    npm?: string,
  },
  os?: string[],
  cpu?: string[],
  private?: boolean,
  workspaces?: string[] | {
    packages: string[],
  },
  publishConfig?: {
    registry?: string,
  },
}

export type TPackage = {
  dir: string,
  json: TPackageJson,
}

export type TPackages = Map<string, TPackage>
