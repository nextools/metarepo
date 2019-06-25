/* eslint-disable no-throw-literal */
import plugin, { StartPlugin } from '@start/plugin'
import { TWorkspacesGitBump, TWorkspacesPackageBump, TPrefixes, TWorkspacesOptions } from '@auto/utils'
import { TGitOptions } from '@auto/git'
import { TBumpOptions } from '@auto/bump'
import { TNpmOptions } from '@auto/npm'
import { TSlackOptions, TGithubOptions, TWorkspacesLog } from '@auto/log'

export type TWorkspacesPluginData = {
  packagesBumps: TWorkspacesPackageBump[],
  gitBumps: TWorkspacesGitBump[],
}

export const makeWorkspacesCommit = (prefixes: TPrefixes, workspacesOptions: TWorkspacesOptions) =>
  plugin('makeWorkspacesCommit', () => async () => {
    const { getWorkspacesPackages } = await import('@auto/fs')
    const { makeWorkspacesCommit } = await import('@auto/git')

    const packages = await getWorkspacesPackages()

    await makeWorkspacesCommit(packages, prefixes, workspacesOptions)
  })

export const getWorkspacesPackagesBumps = (prefixes: TPrefixes, gitOptions: TGitOptions, bumpOptions: TBumpOptions, workspacesOptions: TWorkspacesOptions) =>
  plugin<{}, TWorkspacesPluginData>('getWorkspacesPackagesBumps', () => async () => {
    const { getWorkspacesPackages } = await import('@auto/fs')
    const { getWorkspacesBumps } = await import('@auto/git')
    const { getWorkspacesPackagesBumps } = await import('@auto/bump')

    const packages = await getWorkspacesPackages()
    const gitBumps = await getWorkspacesBumps(packages, prefixes, gitOptions, workspacesOptions)

    if (gitBumps.length === 0) {
      throw new Error('No bumps')
    }

    const packagesBumps = await getWorkspacesPackagesBumps(packages, gitBumps, bumpOptions)

    return {
      packagesBumps,
      gitBumps,
    }
  })

export const publishWorkspacesPrompt = (prefixes: TPrefixes) =>
  plugin<TWorkspacesPluginData, any>('publishWorkspacesPrompt', () => async ({ packagesBumps, gitBumps }) => {
    const { getWorkspacesLog } = await import('@auto/log')
    const { default: prompts } = await import('prompts')

    const logs = getWorkspacesLog(packagesBumps, gitBumps)

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
  plugin<TWorkspacesPluginData, any>('buildBumpedPackages', ({ reporter }) => async ({ packagesBumps }) => {
    const path = await import('path')

    for (const bump of packagesBumps) {
      const packageDir = path.relative(path.resolve('packages/'), bump.dir)
      const taskRunner = await task(packageDir)

      await taskRunner(reporter)()
    }
  })

export const writeWorkspacesPackagesDependencies = plugin<TWorkspacesPluginData, any>('writePackagesDependencies', ({ logMessage }) => async ({ packagesBumps }) => {
  const { writePackageDependencies } = await import('@auto/fs')

  await writePackageDependencies(packagesBumps)
  logMessage('write packages dependencies')
})

export const writeWorkspacesDependenciesCommit = (prefixes: TPrefixes) =>
  plugin<TWorkspacesPluginData, any>('writeWorkspacesDependenciesCommit', ({ logMessage }) => async ({ packagesBumps }) => {
    const { writeWorkspacesDependenciesCommit } = await import('@auto/git')

    await writeWorkspacesDependenciesCommit(packagesBumps, prefixes)
    logMessage('write dependencies commit')
  })

export const writeWorkspacesPackageVersions = plugin<TWorkspacesPluginData, any>('writeWorkspacesPackageVersion', ({ logMessage }) => async ({ packagesBumps }) => {
  const { writeWorkspacesPackageVersions } = await import('@auto/fs')

  await writeWorkspacesPackageVersions(packagesBumps)
  logMessage('write packages versions')
})

export const writeWorkspacesPublishCommit = (prefixes: TPrefixes, workspacesOptions: TWorkspacesOptions) =>
  plugin<TWorkspacesPluginData, any>('writeWorkspacesPublishCommit', ({ logMessage }) => async ({ packagesBumps }) => {
    const { writeWorkspacesPublishCommit } = await import('@auto/git')

    await writeWorkspacesPublishCommit(packagesBumps, prefixes, workspacesOptions)
    logMessage('write publish commit')
  })

export const writeWorkspacesPublishTags = (workspacesOptions: TWorkspacesOptions) =>
  plugin<TWorkspacesPluginData, any>('writeWorkspacesPublishTag', ({ logMessage }) => async ({ packagesBumps }) => {
    const { writeWorkspacesPublishTags } = await import('@auto/git')

    await writeWorkspacesPublishTags(packagesBumps, workspacesOptions)
    logMessage('write publish tag')
  })

export const publishWorkspacesPackagesBumps = (npmOptions?: TNpmOptions) =>
  plugin<TWorkspacesPluginData, any>('publishWorkspacesPackagesBumps', () => async ({ packagesBumps }) => {
    const { publishWorkspacesPackage } = await import('@auto/npm')
    const { default: pAll } = await import('p-all')

    await pAll(
      packagesBumps.map((bump) => () => publishWorkspacesPackage(bump, npmOptions)),
      { concurrency: 4 }
    )
  })

export const sendWorkspacesSlackMessage = (prefixes: TPrefixes, workspacesOptions: TWorkspacesOptions, slackOptions: TSlackOptions, transformFn?: (logs: TWorkspacesLog[]) => TWorkspacesLog[]) =>
  plugin<TWorkspacesPluginData, any>('sendWorkspacesSlackMessage', () => async ({ packagesBumps, gitBumps }) => {
    const { getWorkspacesLog, sendWorkspacesSlackMessage: send } = await import('@auto/log')

    let logs = getWorkspacesLog(packagesBumps, gitBumps)

    if (typeof transformFn === 'function') {
      logs = transformFn(logs)
    }

    await send(logs, prefixes, workspacesOptions, slackOptions)
  })

export const makeWorkspacesGithubReleases = (prefixes: TPrefixes, workspacesOptions: TWorkspacesOptions, githubOptions: TGithubOptions) =>
  plugin<TWorkspacesPluginData, any>('makeWorkspacesGithubReleases', () => async ({ packagesBumps, gitBumps }) => {
    const { getWorkspacesLog, makeWorkspacesGithubReleases: make } = await import('@auto/log')

    const logs = getWorkspacesLog(packagesBumps, gitBumps)

    await make(logs, prefixes, workspacesOptions, githubOptions)
  })
