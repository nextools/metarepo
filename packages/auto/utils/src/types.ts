import { TJsonMap } from 'typeon'

export type TWorkspacesOptions = {
  autoNamePrefix: string,
}

export type TBumpType = 'major' | 'minor' | 'patch'

export type TPrefix = {
  title: string,
  value: string,
}

export type TPrefixes = {
  required: {
    major: TPrefix,
    minor: TPrefix,
    patch: TPrefix,
    publish: TPrefix,
    dependencies: TPrefix,
    initial: TPrefix,
  },
  custom: TPrefix[],
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
  workspaces?: string[] | {
    packages: string[],
  },
  publishConfig?: {
    registry?: string,
  },
} & TJsonMap

export type TPackages = {
  [name: string]: {
    dir: string,
    json: TPackageJson,
  },
}

export type TGitMessageType = TBumpType | 'initial'

export type TGitMessage = {
  type: TGitMessageType,
  value: string,
}

export type TGitBump = {
  name: string,
  type: TBumpType,
  messages: TGitMessage[],
}

export type TPackageBump = {
  name: string,
  type: TBumpType | null,
  version: string | null,
  dir: string,
  deps: {
    [name: string]: string,
  } | null,
  devDeps: {
    [name: string]: string,
  } | null,
}

export type TPrompt = {
  title: string,
  value: string,
}
