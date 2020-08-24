export { auto } from './auto'
export * from './fs/get-packages'
export * from './git/push-commits-and-tags'
export * from './git/write-dependencies-commit'
export * from './git/write-publish-commit'
export * from './npm/publish-packages'
export * from './prompt/make-prompt'
export type {
  TAutoConfig,
  THook,
  THookProps,
  TLogReleaseType,
  TMessage,
  TPackageJson,
  TPackageRelease,
  TPrefixes,
  TReleaseType,
  TRequiredPrefixes,
} from './types'
