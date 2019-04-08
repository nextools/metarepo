/* eslint-disable no-throw-literal */
import plugin from '@start/plugin'
import { TRepoGitBump, TRepoPackageBump, TPrefixes } from '@auto/utils'
import { TGitOptions } from '@auto/git'
import { TBumpOptions } from '@auto/bump'
import { TNpmOptions } from '@auto/npm'
import { TSlackOptions, TGithubOptions, TRepoLog } from '@auto/log'

export type TRepoPluginData = {
  packageBump: TRepoPackageBump,
  gitBump: TRepoGitBump
}

export const makeRepoCommit = (prefixes: TPrefixes) =>
  plugin('makeRepoCommit', () => async () => {
    const { makeRepoCommit } = await import('@auto/git')

    await makeRepoCommit(prefixes)
  })

export const getRepoPackageBumps = (prefixes: TPrefixes, gitOptions: TGitOptions, bumpOptions: TBumpOptions) =>
  plugin<{}, TRepoPluginData>('getRepoPackageBumps', () => async () => {
    const { getRepoPackage } = await import('@auto/fs')
    const { getRepoBump } = await import('@auto/git')
    const { getRepoPackageBump } = await import('@auto/bump')

    const pkg = await getRepoPackage()
    const gitBump = await getRepoBump(prefixes, gitOptions)

    if (gitBump === null) {
      throw new Error('No bumps')
    }

    const packageBump = await getRepoPackageBump(pkg, gitBump, bumpOptions)

    return {
      packageBump,
      gitBump,
    }
  })

export const publishRepoPrompt = (prefixes: TPrefixes) =>
  plugin<TRepoPluginData, any>('publishRepoPrompt', () => async ({ packageBump, gitBump }) => {
    const { getRepoLog } = await import('@auto/log')
    const { default: prompts } = await import('prompts')

    const log = getRepoLog(packageBump, gitBump)

    console.log('')

    console.log(`${log.type} → v${log.version}\n`)

    log.messages.forEach((message) => {
      console.log(`${prefixes.required[message.type].value} ${message.value}`)
    })

    console.log('')

    const { isOk } = await prompts({
      type: 'toggle',
      name: 'isOk',
      message: 'Looks good?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    })

    if (typeof isOk === 'undefined' || isOk === false) {
      throw null
    }
  })

export const writeRepoPackageVersion = plugin<TRepoPluginData, any>('writeRepoPackageVersion', ({ logMessage }) => async ({ packageBump }) => {
  const { writeRepoPackageVersion } = await import('@auto/fs')

  await writeRepoPackageVersion(packageBump)
  logMessage('write package version')
})

export const writeRepoPublishCommit = (prefixes: TPrefixes) =>
  plugin<TRepoPluginData, any>('writeRepoPublishCommit', ({ logMessage }) => async ({ packageBump }) => {
    const { writeRepoPublishCommit } = await import('@auto/git')

    await writeRepoPublishCommit(packageBump, prefixes)
    logMessage('write publish commit')
  })

export const writeRepoPublishTag = plugin<TRepoPluginData, any>('writeRepoPublishTag', ({ logMessage }) => async ({ packageBump }) => {
  const { writeRepoPublishTag } = await import('@auto/git')

  logMessage('write publish tag')
  await writeRepoPublishTag(packageBump)
})

export const publishRepoPackageBump = (npmOptions?: TNpmOptions) =>
  plugin('publishRepoPackageBump', () => async () => {
    const { publishRepoPackage } = await import('@auto/npm')

    await publishRepoPackage(npmOptions)
  })

export const sendRepoSlackMessage = (prefixes: TPrefixes, slackOptions: TSlackOptions, transformFn?: (log: TRepoLog) => TRepoLog) =>
  plugin<TRepoPluginData, any>('sendRepoSlackMessage', () => async ({ packageBump, gitBump }) => {
    const { getRepoLog, sendRepoSlackMessage: send } = await import('@auto/log')
    let log = getRepoLog(packageBump, gitBump)

    if (typeof transformFn === 'function') {
      log = transformFn(log)
    }

    await send(log, prefixes, slackOptions)
  })

export const makeRepoGithubRelease = (prefixes: TPrefixes, githubOptions: TGithubOptions) =>
  plugin<TRepoPluginData, any>('makeRepoGithubRelease', () => async ({ packageBump, gitBump }) => {
    const { getRepoLog, makeRepoGithubRelease: make } = await import('@auto/log')

    const log = getRepoLog(packageBump, gitBump)

    await make(log, prefixes, githubOptions)
  })
