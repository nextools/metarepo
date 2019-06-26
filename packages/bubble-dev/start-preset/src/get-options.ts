import { TBumpType } from '@auto/utils'

export type TStartOptions = {
  file?: string,
  auto: {
    initialType: TBumpType,
    autoNamePrefix: string,
    zeroBreakingChangeType: TBumpType,
    npm?: {
      publishSubDirectory?: string,
      registry?: string,
    },
    shouldAlwaysBumpDependents: boolean,
    shouldMakeGitTags: boolean,
    shouldMakeGitHubReleases: boolean,
    shouldSendSlackMessage: boolean,
    shouldWriteChangelogFiles: boolean,
  },
}

export const getStartOptions = async () => {
  const path = await import('path')
  const { start } = await import(path.resolve('./package.json'))

  return start as TStartOptions
}
