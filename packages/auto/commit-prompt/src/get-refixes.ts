import path from 'path'
import type { TPackageJson } from '@auto/core'
import { isUndefined } from 'tsfn'
import type { TPrefixesWithTitles, TCommitAutoConfig } from './types'

export const getPrefixes = async (): Promise<TPrefixesWithTitles> => {
  const { auto: autoConfig }: TPackageJson = await import(path.resolve('package.json'))

  if (isUndefined(autoConfig)) {
    throw new Error('Cannot find Auto Config')
  }

  const { prefixes } = autoConfig

  if (isUndefined(prefixes)) {
    throw new Error('Cannot find prefixes in Auto Config')
  }

  const autoCommitConfig = autoConfig as TCommitAutoConfig
  const { commit } = autoCommitConfig

  if (isUndefined(commit)) {
    throw new Error('Cannot find Commit Config in Auto Config')
  }

  return Object.keys(prefixes)
    .reduce((res, key) => {
      if (Reflect.has(commit, key)) {
        res[key] = {
          title: commit[key],
          value: prefixes[key],
        }
      }

      return res
    }, {} as TPrefixesWithTitles)
}
