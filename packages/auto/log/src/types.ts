import { TBumpType, TGitMessage } from '@auto/utils'

export type TSlackOptions = {
  token: string,
  channel: string,
  username: string,
  iconEmoji: string,
  colors: {
    major: string,
    minor: string,
    patch: string,
  },
}

export type TGithubOptions = {
  token: string,
  username: string,
  repo: string,
}

export type TWorkspacesLogMessage = {
  type: TBumpType | 'dependencies' | 'initial',
  value: string,
}

export type TWorkspacesLog = {
  name: string,
  version: string,
  type: TBumpType,
  dir: string,
  messages: TWorkspacesLogMessage[],
}

export type TRepoLogMessage = TGitMessage

export type TRepoLog = {
  version: string,
  type: TBumpType,
  messages: TRepoLogMessage[],
}
