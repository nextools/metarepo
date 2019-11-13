import path from 'path'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import copy from '@start/plugin-copy'
import {
  makeCommit,
  buildBumpedPackages,
  getPackagesBumps,
  publishPrompt,
  writePackagesDependencies,
  writeDependenciesCommit,
  writePackageVersions,
  writePublishCommit,
  publishPackagesBumps,
  pushCommitsAndTags,
  writePublishTags,
  makeGithubReleases,
  sendSlackMessage,
  sendTelegramMessage,
  writeChangelogFiles,
} from '@auto/start-plugin'
import { TGithubOptions, TSlackOptions, TTelegramOptions } from '@auto/log'
import { TGitOptions } from '@auto/git'
import { TWorkspacesOptions } from '@auto/utils'
import { TBumpOptions } from '@auto/bump'
import { TNpmOptions } from '@auto/npm'
import runVerdaccio from './plugins/run-verdaccio'
import { getStartOptions } from './utils'
import { removeYarnCache } from './plugins/remove-yarn-cache'
import buildPackageJson from './plugins/build-package-json'
import { buildPackage } from './build'

export const preparePackage = (packageDir: string) => {
  const dir = path.join('packages', packageDir)

  return sequence(
    find(`${dir}/{readme,license}.md`),
    copy(`${dir}/build/`),
    buildPackageJson(dir)
  )
}

export const commit = async () => {
  const { auto: { autoNamePrefix } } = await getStartOptions()
  const { prefixes } = await import('./config/auto')

  const workspacesOptions: TWorkspacesOptions = {
    autoNamePrefix,
  }

  return makeCommit(prefixes, workspacesOptions)
}

export const publish = async () => {
  const {
    auto: {
      initialType,
      autoNamePrefix,
      zeroBreakingChangeType,
      npm,
      shouldAlwaysBumpDependents = false,
      shouldMakeGitTags = false,
      shouldMakeGitHubReleases = false,
      shouldSendSlackMessage = false,
      shouldSendTelegramMessage = false,
      shouldWriteChangelogFiles = false,
    },
  } = await getStartOptions()
  const { prefixes } = await import('./config/auto')

  const npmOptions: TNpmOptions = npm || {}
  const workspacesOptions: TWorkspacesOptions = {
    autoNamePrefix,
  }
  const bumpOptions: TBumpOptions = {
    zeroBreakingChangeType,
    shouldAlwaysBumpDependents,
  }
  const gitOptions: TGitOptions = {
    initialType,
  }
  const githubOptions: TGithubOptions = {
    token: process.env.AUTO_GITHUB_TOKEN as string,
    username: process.env.AUTO_GITHUB_USERNAME as string,
    repo: process.env.AUTO_GITHUB_REPO as string,
  }
  const slackOptions: TSlackOptions = {
    token: process.env.AUTO_SLACK_TOKEN as string,
    channel: process.env.AUTO_SLACK_CHANNEL as string,
    username: process.env.AUTO_SLACK_USERNAME as string,
    iconEmoji: process.env.AUTO_SLACK_ICON_EMOJI as string,
    colors: {
      major: process.env.AUTO_SLACK_COLOR_MAJOR as string,
      minor: process.env.AUTO_SLACK_COLOR_MINOR as string,
      patch: process.env.AUTO_SLACK_COLOR_PATCH as string,
    },
  }
  const telegramOptions: TTelegramOptions = {
    token: process.env.AUTO_TELEGRAM_TOKEN as string,
    chatId: process.env.AUTO_TELEGRAM_CHAT_ID as string,
  }

  return sequence(
    getPackagesBumps(prefixes, gitOptions, bumpOptions, workspacesOptions),
    publishPrompt(prefixes),
    buildBumpedPackages(buildPackage),
    writePackagesDependencies,
    writeDependenciesCommit(prefixes),
    writePackageVersions,
    shouldWriteChangelogFiles && writeChangelogFiles(prefixes),
    writePublishCommit(prefixes, workspacesOptions),
    shouldMakeGitTags && writePublishTags(workspacesOptions),
    buildBumpedPackages(preparePackage),
    publishPackagesBumps(npmOptions),
    pushCommitsAndTags,
    shouldMakeGitHubReleases && makeGithubReleases(prefixes, workspacesOptions, githubOptions),
    shouldSendSlackMessage && sendSlackMessage(prefixes, workspacesOptions, slackOptions),
    shouldSendTelegramMessage && sendTelegramMessage(prefixes, workspacesOptions, telegramOptions)
  )
}

export const testPublish = async () => {
  const {
    auto: {
      initialType,
      autoNamePrefix,
      zeroBreakingChangeType,
      npm,
      shouldAlwaysBumpDependents = false,
    },
  } = await getStartOptions()
  const { prefixes } = await import('./config/auto')

  const npmOptions: TNpmOptions = {
    ...npm,
    registry: 'http://localhost:4873',
  }
  const workspacesOptions: TWorkspacesOptions = {
    autoNamePrefix,
  }
  const bumpOptions: TBumpOptions = {
    zeroBreakingChangeType,
    shouldAlwaysBumpDependents,
  }
  const gitOptions: TGitOptions = {
    initialType,
  }

  const verdaccioConfigPath = require.resolve('./config/verdaccio.yml')

  return sequence(
    getPackagesBumps(prefixes, gitOptions, bumpOptions, workspacesOptions),
    publishPrompt(prefixes),
    buildBumpedPackages(buildPackage),
    writePackagesDependencies,
    writePackageVersions,
    buildBumpedPackages(preparePackage),
    runVerdaccio(verdaccioConfigPath),
    publishPackagesBumps(npmOptions),
    removeYarnCache
  )
}
