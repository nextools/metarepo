import { isUndefined, isFunction } from 'tsfn'
import type { TReadonly } from 'tsfn'
import { getPackagesBumps } from './bump/get-packages-bumps'
import type { TPackageBumpMap } from './bump/types'
import { getPackages } from './fs/get-packages'
import { readPackage } from './fs/read-package'
import { writePackagesDependencies } from './fs/write-packages-dependencies'
import { writePackagesVersions } from './fs/write-packages-versions'
import { getBumps } from './git/get-bumps'
import { getCommitMessages } from './git/get-commit-messages'
import { pushCommitsAndTags } from './git/push-commits-and-tags'
import { writeDependenciesCommit } from './git/write-dependencies-commit'
import { writePublishCommit } from './git/write-publish-commit'
import { publishPackages } from './npm/publish-packages'
import { makePrompt } from './prompt/make-prompt'
import { promptLog } from './prompt/prompt-log'
import type { TPromptEditResult } from './prompt/types'
import type { TAutoHooks, THookProps } from './types'
import { compilePackageReleases } from './utils'

export const auto = async (hooks: Readonly<TAutoHooks> = {}) => {
  const { auto: config } = await readPackage(process.cwd())

  if (isUndefined(config)) {
    throw new Error('Cannot find Auto Config in root package.json')
  }

  const prefixes = config.prefixes

  if (isUndefined(prefixes)) {
    throw new Error('Cannot find prefixes in Auto Config')
  }

  const allPackages = await getPackages()
  const commitMessages: readonly string[] = await getCommitMessages()
  const gitBumps = getBumps(Array.from(allPackages.keys()), prefixes, commitMessages)

  if (gitBumps.size === 0) {
    throw new Error('No bumps')
  }

  let packagesBumps: TPackageBumpMap
  let editResult: TPromptEditResult | undefined

  // PROMPT
  while (true) {
    packagesBumps = getPackagesBumps({
      packages: allPackages,
      bumps: gitBumps,
      edit: editResult,
      config: config.bump,
    })

    promptLog(packagesBumps, gitBumps, prefixes)

    const promptResult = await makePrompt(allPackages, packagesBumps, editResult)

    if (promptResult.type === 'YES') {
      break
    }

    if (promptResult.type === 'EDIT') {
      editResult = promptResult

      continue
    }

    throw null
  }

  const packages = compilePackageReleases(allPackages, packagesBumps, gitBumps)

  // BUILD
  if (hooks.build !== false) {
    const props: TReadonly<THookProps> = {
      config,
      prefixes,
      packages,
    }

    if (isFunction(hooks.preBuild)) {
      await hooks.preBuild(props)
    }

    await hooks.build?.(props)

    if (isFunction(hooks.postBuild)) {
      await hooks.postBuild(props)
    }
  }

  await writePackagesDependencies(packages)

  // DEPS COMMIT
  if (hooks.depsCommit !== false) {
    const props: TReadonly<THookProps> = {
      config,
      prefixes,
      packages,
    }

    if (isFunction(hooks.preDepsCommit)) {
      await hooks.preDepsCommit(props)
    }

    if (isUndefined(hooks.depsCommit)) {
      await writeDependenciesCommit()(props)
    } else {
      await hooks.depsCommit(props)
    }

    if (isFunction(hooks.postDepsCommit)) {
      await hooks.postDepsCommit(props)
    }
  }

  await writePackagesVersions(packages)

  // PUBLISH COMMIT
  if (hooks.publishCommit !== false) {
    const props: TReadonly<THookProps> = {
      config,
      prefixes,
      packages,
    }

    if (isFunction(hooks.prePublishCommit)) {
      await hooks.prePublishCommit(props)
    }

    if (isUndefined(hooks.publishCommit)) {
      await writePublishCommit()(props)
    } else {
      await hooks.publishCommit(props)
    }

    if (isFunction(hooks.postPublishCommit)) {
      await hooks.postPublishCommit(props)
    }
  }

  // PUBLISH
  if (hooks.publish !== false) {
    const props: TReadonly<THookProps> = {
      config,
      prefixes,
      packages,
    }

    if (isFunction(hooks.prePublish)) {
      await hooks.prePublish(props)
    }

    if (isUndefined(hooks.publish)) {
      await publishPackages()(props)
    } else {
      await hooks.publish(props)
    }

    if (isFunction(hooks.postPublish)) {
      await hooks.postPublish(props)
    }
  }

  // PUSH
  if (hooks.push !== false) {
    const props: TReadonly<THookProps> = {
      config,
      prefixes,
      packages,
    }

    if (isFunction(hooks.prePush)) {
      await hooks.prePush(props)
    }

    if (isUndefined(hooks.push)) {
      await pushCommitsAndTags()(props)
    } else {
      await hooks.push(props)
    }

    if (isFunction(hooks.postPush)) {
      await hooks.postPush(props)
    }
  }
}
