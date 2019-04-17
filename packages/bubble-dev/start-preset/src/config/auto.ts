import { TGitOptions } from '@auto/git'
import { TPrefixes, TWorkspacesOptions } from '@auto/utils'
import { TBumpOptions } from '@auto/bump'
import { TNpmOptions } from '@auto/npm'
import { TGithubOptions, TSlackOptions } from '@auto/log'

export const prefixes: TPrefixes = {
  required: {
    major: {
      title: 'Breaking change',
      value: '💥',
    },
    minor: {
      title: 'New feature',
      value: '🌱',
    },
    patch: {
      title: 'Bugfix',
      value: '🐞',
    },
    publish: {
      title: 'New version',
      value: '📦',
    },
    dependencies: {
      title: 'Dependencies',
      value: '♻️',
    },
    initial: {
      title: 'Initial',
      value: '🐣',
    },
  },
  custom: [
    {
      title: 'Dependencies',
      value: '♻️',
    },
    {
      title: 'Lint',
      value: '🚷',
    },
    {
      title: 'Test',
      value: '👾',
    },
    {
      title: 'Docs',
      value: '📝',
    },
    {
      title: 'Demo',
      value: '📺',
    },
    {
      title: 'Refactor',
      value: '🛠',
    },
    {
      title: 'WIP',
      value: '🚧',
    },
    {
      title: 'Snapshots / Screenshots',
      value: '📸',
    },
    {
      title: 'Other',
      value: '🛠',
    },
  ],
}

export const gitOptions: TGitOptions = {
  initialType: 'minor',
}

export const bumpOptions: TBumpOptions = {
  zeroBreakingChangeType: 'minor',
  shouldAlwaysBumpDependents: false,
}

export const npmOptions: TNpmOptions = {
  publishSubDirectory: 'build/',
}

export const workspacesOptions: TWorkspacesOptions = {
  autoNamePrefix: '@',
}

export const githubOptions: TGithubOptions = {
  username: process.env.AUTO_GITHUB_USERNAME as string,
  repo: process.env.AUTO_GITHUB_REPO as string,
  token: process.env.AUTO_GITHUB_TOKEN as string,
}

export const slackOptions: TSlackOptions = {
  username: process.env.AUTO_SLACK_USERNAME as string,
  channel: process.env.AUTO_SLACK_CHANNEL as string,
  iconEmoji: process.env.AUTO_SLACK_ICON_EMOJI as string,
  colors: {
    major: process.env.AUTO_SLACK_COLOR_MAJOR as string,
    minor: process.env.AUTO_SLACK_COLOR_MINOR as string,
    patch: process.env.AUTO_SLACK_COLOR_PATCH as string,
  },
  token: process.env.AUTO_SLACK_TOKEN as string,
}
