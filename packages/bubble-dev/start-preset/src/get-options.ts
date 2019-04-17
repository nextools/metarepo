import { TBumpType } from '@auto/utils'

export type TStartOptions = {
  file?: string,
  auto: {
    initialType: TBumpType,
    autoNamePrefix: string,
    zeroBreakingChangeType: TBumpType,
    github: {
      username: string,
      repo: string,
    },
    slack: {
      channel: string,
      username: string,
      iconEmoji: string,
      colors: {
        major: string,
        minor: string,
        patch: string,
      },
    },
    shouldAlwaysBumpDependents: boolean,
    shouldMakeGitTags: boolean,
    shouldMakeGitHubReleases: boolean,
    shouldSendSlackMessage: boolean,
  },
}

export const getStartOptions = async () => {
  const path = await import('path')
  const { start } = await import(path.resolve('./package.json'))

  return start as TStartOptions
}
