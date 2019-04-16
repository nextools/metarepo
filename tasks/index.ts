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
import {
  makeWorkspacesCommit,
  buildBumpedPackages,
  getWorkspacesPackagesBumps,
  publishWorkspacesPrompt,
  writeWorkspacesPackagesDependencies,
  writeWorkspacesDependenciesCommit,
  writeWorkspacesPackageVersions,
  writeWorkspacesPublishCommit,
  publishWorkspacesPackagesBumps,
  pushCommitsAndTags,
  writeWorkspacesPublishTags,
} from '@auto/start-plugin'
import tape from '@start/plugin-lib-tape'
import { istanbulInstrument, istanbulReport } from '@start/plugin-lib-istanbul'
// @ts-ignore
import tapDiff from 'tap-diff'
import move from './plugins/move'
import buildPackageJson from './plugins/build-package-json'

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
    move((file) => file.replace(/\.web\.d\.ts$/, '.d.ts'))
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
    move((file) => file.replace(/\.native\.d\.ts$/, '.d.ts'))
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
    move((file) => file.replace(/\.node\.d\.ts$/, '.d.ts'))
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
    move((file) => file.replace(/\.web\.d\.ts$/, '.d.ts'))
  )
}

export const buildCopy = (dir: string) =>
  sequence(
    find(`${dir}/src/**/*`),
    copy(`${dir}/build/`)
  )

export const build = async (packageDir: string) => {
  const dir = path.join('packages', packageDir)
  const packageJsonPath = path.resolve(dir, 'package.json')
  const { default: globby } = await import('globby')
  const { default: packageJson } = await import(packageJsonPath)
  const tasks = []

  if (Reflect.has(packageJson, 'main')) {
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

  if (tasks.length === 0) {
    tasks.push('buildCopy')
  }

  return sequence(
    env({ NODE_ENV: 'production' }),
    find(`${dir}/build/`),
    remove,
    parallel(tasks)(dir)
  )
}

export const commit = async () => {
  const { prefixes, workspacesOptions } = await import('./config/auto')

  return makeWorkspacesCommit(prefixes, workspacesOptions)
}

export const publish = async () => {
  const { prefixes, workspacesOptions, gitOptions, bumpOptions, npmOptions } = await import('./config/auto')

  return sequence(
    getWorkspacesPackagesBumps(prefixes, gitOptions, bumpOptions, workspacesOptions),
    publishWorkspacesPrompt(prefixes),
    buildBumpedPackages(build),
    writeWorkspacesPackagesDependencies,
    writeWorkspacesDependenciesCommit(prefixes),
    writeWorkspacesPackageVersions,
    writeWorkspacesPublishCommit(prefixes, workspacesOptions),
    writeWorkspacesPublishTags(workspacesOptions),
    buildBumpedPackages(preparePackage),
    publishWorkspacesPackagesBumps(npmOptions),
    pushCommitsAndTags
  )
}

export const lint = () =>
  sequence(
    find([
      'packages/*/{src,test}/**/*.ts',
      'packages/*/*/{src,test}/**/*.ts',
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
      'packages/*/{src,test}/**/*.ts',
      'packages/*/*/{src,test}/**/*.ts',
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
    find([
      `packages/${packageDir}/src/**/*.{ts,tsx}`,
      `packages/${packageDir}/*/src/**/*.{ts,tsx}`,
    ]),
    istanbulInstrument({ esModules: true }, ['.ts', '.tsx']),
    find([
      `packages/${packageDir}/test/**/*.{ts,tsx}`,
      `packages/${packageDir}/*/test/**/*.{ts,tsx}`,
    ]),
    tape(tapDiff),
    istanbulReport(['lcovonly', 'html', 'text-summary'])
  )

export const ci = () =>
  sequence(
    lint(),
    test()
  )
