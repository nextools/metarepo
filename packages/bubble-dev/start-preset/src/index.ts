import path from 'path'
import { JsxEmit } from 'typescript'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import remove from '@start/plugin-remove'
import read from '@start/plugin-read'
import babel from '@start/plugin-lib-babel'
import rename from '@start/plugin-rename'
import write from '@start/plugin-write'
import copy from '@start/plugin-copy'
import overwrite from '@start/plugin-overwrite'
import env from '@start/plugin-env'
import parallel from '@start/plugin-parallel'
import eslint from '@start/plugin-lib-eslint'
import typescriptGenerate from '@start/plugin-lib-typescript-generate'
import typescriptCheck from '@start/plugin-lib-typescript-check'
import codecov from '@start/plugin-lib-codecov'
import tape from '@start/plugin-lib-tape'
import { istanbulInstrument, istanbulReport } from '@start/plugin-lib-istanbul'
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
  writeChangelogFiles,
} from '@auto/start-plugin'
// @ts-ignore
import tapDiff from 'tap-diff'
import { TGithubOptions, TSlackOptions } from '@auto/log'
import { TGitOptions } from '@auto/git'
import { TWorkspacesOptions } from '@auto/utils'
import { TBumpOptions } from '@auto/bump'
import { TNpmOptions } from '@auto/npm'
import move from './plugins/move'
import transformDts from './plugins/transform-dts'
import buildPackageJson from './plugins/build-package-json'
import buildAssets from './plugins/build-assets'
import { getStartOptions } from './get-options'

export const preparePackage = (packageDir: string) => {
  const dir = path.join('packages', packageDir)

  return sequence(
    find(`${dir}/*.md`),
    copy(`${dir}/build/`),
    buildPackageJson(dir)
  )
}

export const buildWeb = async (dir: string) => {
  const { babelConfigWeb } = await import('./config/babel')

  return sequence(
    find([
      `${dir}/src/**/*.{js,ts,tsx}`,
      `!${dir}/src/**/*.{node,native,ios,android}.{js,ts,tsx}`,
    ]),
    read,
    babel(babelConfigWeb),
    rename((file) => file.replace(/(\.web)?\.(ts|tsx)$/, '.js')),
    write(`${dir}/build/web/`),
    find(`${dir}/src/index.{web.tsx,web.ts,tsx,ts}`),
    typescriptGenerate(`${dir}/build/web/`, {
      strict: true,
      jsx: JsxEmit.React,
      preserveSymlinks: true,
      skipLibCheck: true,
    }),
    find(`${dir}/build/web/*.web.d.ts`),
    move((file) => file.replace(/\.web\.d\.ts$/, '.d.ts')),
    find(`${dir}/build/web/*.d.ts`),
    read,
    transformDts('web'),
    overwrite
  )
}

export const buildReactNative = async (dir: string) => {
  const { babelConfigReactNative } = await import('./config/babel')

  return sequence(
    find([
      `${dir}/src/**/*.{js,ts,tsx}`,
      `!${dir}/src/**/*.{node,web}.{js,ts,tsx}`,
    ]),
    read,
    babel(babelConfigReactNative),
    rename((file) => file.replace(/(\.native)?\.(ts|tsx)$/, '.js')),
    write(`${dir}/build/native/`),
    find(`${dir}/src/index.{native.tsx,native.ts,ios.tsx,ios.ts,android.tsx,android.ts,tsx,ts}`),
    typescriptGenerate(`${dir}/build/native/`, {
      strict: true,
      jsx: JsxEmit.React,
      preserveSymlinks: true,
      skipLibCheck: true,
    }),
    find(`${dir}/build/native/*.native.d.ts`),
    move((file) => file.replace(/\.native\.d\.ts$/, '.d.ts')),
    find(`${dir}/build/native/*.d.ts`),
    read,
    transformDts('native'),
    overwrite
  )
}

export const buildNode = async (dir: string) => {
  const { babelConfigNode } = await import('./config/babel')

  return sequence(
    find([
      `${dir}/src/**/*.{js,ts,tsx}`,
      `!${dir}/src/**/*.{web,native,ios,android}.{js,ts,tsx}`,
    ]),
    read,
    babel(babelConfigNode),
    rename((file) => file.replace(/(\.node)?\.(ts|tsx)$/, '.js')),
    write(`${dir}/build/node/`),
    find(`${dir}/src/index.{node.tsx,node.ts,tsx,ts}`),
    typescriptGenerate(`${dir}/build/node/`, {
      strict: true,
      jsx: JsxEmit.React,
      preserveSymlinks: true,
      skipLibCheck: true,
    }),
    find(`${dir}/build/node/*.node.d.ts`),
    move((file) => file.replace(/\.node\.d\.ts$/, '.d.ts')),
    find(`${dir}/build/node/*.d.ts`),
    read,
    transformDts('node'),
    overwrite
  )
}

export const buildWebNode = async (dir: string) => {
  const { babelConfigNode } = await import('./config/babel')

  return sequence(
    find([
      `${dir}/src/**/*.{js,ts,tsx}`,
      `!${dir}/src/**/*.{native,ios,android}.{js,ts,tsx}`,
    ]),
    read,
    babel(babelConfigNode),
    rename((file) => file.replace(/(\.web)?\.(ts|tsx)$/, '.js')),
    write(`${dir}/build/node/`),
    find(`${dir}/src/index.{web.tsx,web.ts,tsx,ts}`),
    typescriptGenerate(`${dir}/build/node/`, {
      strict: true,
      jsx: JsxEmit.React,
      preserveSymlinks: true,
      skipLibCheck: true,
    }),
    find(`${dir}/build/node/*.web.d.ts`),
    move((file) => file.replace(/\.web\.d\.ts$/, '.d.ts')),
    find(`${dir}/build/node/*.d.ts`),
    read,
    transformDts('node'),
    overwrite
  )
}

const buildPackage = async (packageDir: string) => {
  const dir = path.join('packages', packageDir)
  const packageJsonPath = path.resolve(dir, 'package.json')
  const { default: packageJson } = await import(packageJsonPath)

  const tasks = []

  if (Reflect.has(packageJson, 'main')) {
    const { default: globby } = await import('globby')
    const nodeFiles = await globby(`${dir}/src/**/*.node.{ts,tsx}`, {
      ignore: ['node_modules/**'],
      deep: true,
      onlyFiles: true,
    })

    // "node" is "web" if there are no `.node.{ts,tsx}` files
    tasks.push(nodeFiles.length > 0 ? 'buildNode' : 'buildWebNode')
  }

  if (Reflect.has(packageJson, 'browser')) {
    tasks.push('buildWeb')
  }

  if (Reflect.has(packageJson, 'react-native')) {
    tasks.push('buildReactNative')
  }

  return sequence(
    env({ NODE_ENV: 'production' }),
    find(`${dir}/build/`),
    remove,
    parallel(tasks)(dir),
    Reflect.has(packageJson, 'buildAssets') && buildAssets(dir, packageJson.buildAssets)
  )
}

export const build = async (...packageDirs: string[]) => {
  if (packageDirs.length > 0) {
    return sequence(
      // @ts-ignore
      ...packageDirs.map(buildPackage)
    )
  }

  const { default: prompts } = await import('prompts')
  const { getPackages } = await import('@auto/fs')
  const { suggestFilter, makeRegExp } = await import('./utils')

  const baseDir = path.resolve('packages')
  const packages = await getPackages()
  const choices = Object.keys(packages)
    .map((name) => ({
      title: name.replace(/^@/, ''),
      value: path.relative(baseDir, packages[name].dir),
    }))
  const packageNames: string[] = []

  while (true) {
    const { packageName } = await prompts({
      type: 'autocomplete',
      name: 'packageName',
      message: 'Type package name',
      limit: 20,
      choices: choices.filter((choice) => !packageNames.includes(choice.value)),
      suggest: suggestFilter(packageNames.length > 0 ? '(done)' : null),
    }) as { packageName?: string }

    if (typeof packageName === 'undefined') {
      throw new Error('Package name is required')
    }

    if (packageName === '-') {
      break
    }

    if (packageName === '*') {
      return sequence(
        // @ts-ignore
        ...choices.map(({ value }) => buildPackage(value))
      )
    }

    if (packageName.includes('*')) {
      const regExp = makeRegExp(packageName)
      const filteredpackages = choices
        .map(({ value }) => value)
        .filter((value) => regExp.test(value))

      packageNames.push(...filteredpackages)

      continue
    }

    packageNames.push(packageName)
  }

  return sequence(
    // @ts-ignore
    ...packageNames.map(buildPackage)
  )
}

export const lint = () =>
  sequence(
    find([
      'packages/**/{src,test}/**/*.{ts,tsx}',
      'tasks/**/*.ts',
    ]),
    read,
    eslint({
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint',
    }),
    typescriptCheck({
      lib: ['esnext', 'dom'],
      typeRoots: ['types/', 'node_modules/@types/'],
    })
  )

export const fix = () =>
  sequence(
    find([
      'packages/**/{src,test}/**/*.{ts,tsx}',
      'tasks/**/*.ts',
    ]),
    read,
    eslint({
      fix: true,
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint',
    }),
    overwrite
  )

export const test = (packageDir: string = '**') =>
  sequence(
    env({ NODE_ENV: 'test' }),
    find(`coverage/`),
    remove,
    find(`packages/${packageDir}/src/**/*.{ts,tsx}`),
    istanbulInstrument({ esModules: true }, ['.ts', '.tsx']),
    find(`packages/${packageDir}/test/**/*.{ts,tsx}`),
    tape(tapDiff),
    istanbulReport(['lcovonly', 'html', 'text-summary'])
  )

export const ci = () =>
  sequence(
    lint(),
    test(),
    find('coverage/lcov.info'),
    read,
    codecov
  )

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
      github,
      slack,
      shouldAlwaysBumpDependents,
      shouldMakeGitTags,
      shouldMakeGitHubReleases,
      shouldSendSlackMessage,
      shouldWriteChangelogFiles,
    },
  } = await getStartOptions()
  const { prefixes } = await import('./config/auto')

  const npmOptions: TNpmOptions = {
    publishSubDirectory: 'build/',
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
  const githubOptions: TGithubOptions = {
    ...github,
    token: process.env.AUTO_GITHUB_TOKEN as string,
  }
  const slackOptions: TSlackOptions = {
    ...slack,
    token: process.env.AUTO_SLACK_TOKEN as string,
  }

  // TODO: refactor Auto options into one config
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
    shouldSendSlackMessage && sendSlackMessage(prefixes, workspacesOptions, slackOptions)
  )
}
