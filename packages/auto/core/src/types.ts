import type { TReadonly } from 'tsfn'

export type TResolvedReleaseType = 'major' | 'minor' | 'patch'

export type TReleaseType = TResolvedReleaseType | 'initial'

export type TLogReleaseType = TReleaseType | 'dependencies'

export type TPrefixReleaseType = TLogReleaseType | 'publish'

export type TRequiredPrefixes = {
  [k in TPrefixReleaseType]: string
}

export type TPrefixes = TRequiredPrefixes & {
  [k: string]: string,
}

export type TBumpConfig = {
  shouldAlwaysBumpDependents?: boolean,
}

export type TNpmConfig = {
  registry?: string,
  publishSubDirectory?: string,
  access?: 'restricted' | 'public',
}

export type TAutoConfig = {
  prefixes?: TPrefixes,
  bump?: TBumpConfig,
  npm?: TNpmConfig,
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
  workspaces?: string[] | {
    packages: string[],
  },
  publishConfig?: {
    registry?: string,
  },
  auto?: TAutoConfig,
}

export type TPackage = {
  dir: string,
  json: TPackageJson,
}

export type TPackageMap = Map<string, TPackage>

export type TPackageIgnoreMap = Map<string, string[]>

export type TPromptEditData = {
  dependencyBumpIgnoreMap: TPackageIgnoreMap,
  initialTypeOverrideMap: Map<string, TResolvedReleaseType>,
  zeroBreakingTypeOverrideMap: Map<string, TResolvedReleaseType>,
}

export type TMessage<T extends TPrefixReleaseType> = {
  type: T,
  message: string,
  description?: string,
}

export type TGitMessageMap = Map<string, TMessage<TReleaseType>[]>

export type THookProps = {
  config: TAutoConfig,
  prefixes: TRequiredPrefixes,
  packages: TPackageRelease[],
}

export type THook = (props: TReadonly<THookProps>) => Promise<void>

export type TAutoHooks = {
  preDepsCommit?: THook | false,
  depsCommit?: THook | false,
  postDepsCommit?: THook | false,
  prePublishCommit?: THook | false,
  publishCommit?: THook | false,
  postPublishCommit?: THook | false,
  preBuild?: THook | false,
  build?: THook | false,
  postBuild?: THook | false,
  prePublish?: THook | false,
  publish?: THook | false,
  postPublish?: THook | false,
  prePush?: THook | false,
  push?: THook | false,
  postPush?: THook | false,
}

export type TPackageRelease = {
  name: string,
  type: TReleaseType | null,
  version: string | null,
  dir: string,
  json: TPackageJson,
  deps: {
    [name: string]: string,
  } | null,
  devDeps: {
    [name: string]: string,
  } | null,
  messages: TMessage<TReleaseType>[] | null,
}
