/* eslint-disable no-throw-literal */
import plugin, { StartPlugin } from '@start/plugin'
import { TGitBump, TPackageBump, TPrefixes, TWorkspacesOptions } from '@auto/utils'
import { TGitOptions } from '@auto/git'
import { TBumpOptions } from '@auto/bump'
import { TNpmOptions } from '@auto/npm'
import { TSlackOptions, TGithubOptions, TLog } from '@auto/log'

export const pushCommitsAndTags = plugin<any, any>('pushCommitsAndTags', () => async () => {
  const { pushCommitsAndTags: push } = await import('@auto/git')

  await push()
})

export type TPluginData = {
  packagesBumps: TPackageBump[],
  gitBumps: TGitBump[],
}

export const makeCommit = (prefixes: TPrefixes, Options: TWorkspacesOptions) =>
  plugin('makeCommit', () => async () => {
    const { getPackages } = await import('@auto/fs')
    const { makeCommit } = await import('@auto/git')

    const packages = await getPackages()

    await makeCommit(packages, prefixes, Options)
  })

export const getPackagesBumps = (prefixes: TPrefixes, gitOptions: TGitOptions, bumpOptions: TBumpOptions, Options: TWorkspacesOptions) =>
  plugin<{}, TPluginData>('getPackagesBumps', () => async () => {
    const { getPackages } = await import('@auto/fs')
    const { getBumps } = await import('@auto/git')
    const { getPackagesBumps } = await import('@auto/bump')

    const packages = await getPackages()
    const gitBumps = await getBumps(packages, prefixes, gitOptions, Options)

    if (gitBumps.length === 0) {
      throw new Error('No bumps')
    }

    const packagesBumps = await getPackagesBumps(packages, gitBumps, bumpOptions)

    return {
      packagesBumps,
      gitBumps,
    }
  })

export const publishPrompt = (prefixes: TPrefixes) =>
  plugin<TPluginData, any>('publishPrompt', () => async ({ packagesBumps, gitBumps }) => {
    const { getLog } = await import('@auto/log')
    const { default: prompts } = await import('prompts')

    const logs = getLog(packagesBumps, gitBumps)

    logs.forEach((log) => {
      console.log('')

      console.log(`${log.name} → ${log.type} → v${log.version}\n`)

      log.messages.forEach((message) => {
        console.log(`${prefixes.required[message.type].value} ${message.value}`)
      })
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

export const buildBumpedPackages = (task: (...args: any[]) => StartPlugin<{}, any>) =>
  plugin<TPluginData, any>('buildBumpedPackages', ({ reporter }) => async ({ packagesBumps }) => {
    const path = await import('path')

    for (const bump of packagesBumps) {
      if (bump.type === null) {
        continue
      }

      const packageDir = path.relative(path.resolve('packages/'), bump.dir)
      const taskRunner = await task(packageDir)

      await taskRunner(reporter)()
    }
  })

export const writePackagesDependencies = plugin<TPluginData, any>('writePackagesDependencies', ({ logMessage }) => async ({ packagesBumps }) => {
  const { writePackageDependencies } = await import('@auto/fs')

  await writePackageDependencies(packagesBumps)
  logMessage('write packages dependencies')
})

export const writeDependenciesCommit = (prefixes: TPrefixes) =>
  plugin<TPluginData, any>('writeDependenciesCommit', ({ logMessage }) => async ({ packagesBumps }) => {
    const { writeDependenciesCommit } = await import('@auto/git')

    await writeDependenciesCommit(packagesBumps, prefixes)
    logMessage('write dependencies commit')
  })

export const writePackageVersions = plugin<TPluginData, any>('writePackageVersion', ({ logMessage }) => async ({ packagesBumps }) => {
  const { writePackageVersions } = await import('@auto/fs')

  await writePackageVersions(packagesBumps)
  logMessage('write packages versions')
})

export const writePublishCommit = (prefixes: TPrefixes, Options: TWorkspacesOptions) =>
  plugin<TPluginData, any>('writePublishCommit', ({ logMessage }) => async ({ packagesBumps }) => {
    const { writePublishCommit } = await import('@auto/git')

    await writePublishCommit(packagesBumps, prefixes, Options)
    logMessage('write publish commit')
  })

export const writePublishTags = (Options: TWorkspacesOptions) =>
  plugin<TPluginData, any>('writePublishTag', ({ logMessage }) => async ({ packagesBumps }) => {
    const { writePublishTags } = await import('@auto/git')

    await writePublishTags(packagesBumps, Options)
    logMessage('write publish tag')
  })

export const publishPackagesBumps = (npmOptions?: TNpmOptions) =>
  plugin<TPluginData, any>('publishPackagesBumps', () => async ({ packagesBumps }) => {
    const { publishPackage } = await import('@auto/npm')
    const { default: pAll } = await import('p-all')

    const bumps = packagesBumps
      .filter((bump) => bump.type !== null)
      .map((bump) => () => publishPackage(bump, npmOptions))

    await pAll(bumps, { concurrency: 4 })
  })

export const sendSlackMessage = (prefixes: TPrefixes, Options: TWorkspacesOptions, slackOptions: TSlackOptions, transformFn?: (logs: TLog[]) => TLog[]) =>
  plugin<TPluginData, any>('sendSlackMessage', () => async ({ packagesBumps, gitBumps }) => {
    const { getLog, sendSlackMessage: send } = await import('@auto/log')

    let logs = getLog(packagesBumps, gitBumps)

    if (typeof transformFn === 'function') {
      logs = transformFn(logs)
    }

    await send(logs, prefixes, Options, slackOptions)
  })

export const makeGithubReleases = (prefixes: TPrefixes, Options: TWorkspacesOptions, githubOptions: TGithubOptions) =>
  plugin<TPluginData, any>('makeGithubReleases', () => async ({ packagesBumps, gitBumps }) => {
    const { getLog, makeGithubReleases: make } = await import('@auto/log')

    const logs = getLog(packagesBumps, gitBumps)

    await make(logs, prefixes, Options, githubOptions)
  })

export const writeChangelogFiles = (prefixes: TPrefixes) =>
  plugin<TPluginData, any>('writeChangelogFiles', () => async ({ packagesBumps, gitBumps }) => {
    const { getLog, writeChangelogFiles: write } = await import('@auto/log')

    const logs = getLog(packagesBumps, gitBumps)

    await write(logs, prefixes)
  })
