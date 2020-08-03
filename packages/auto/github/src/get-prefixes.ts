import path from 'path'
import type { TPackageJson, TPrefixes } from '@auto/core'
import { isUndefined } from 'tsfn'

export const getPrefixes = async (): Promise<TPrefixes> => {
  const { auto }: TPackageJson = await import(path.resolve('package.json'))

  if (isUndefined(auto)) {
    throw new Error('Cannot find Auto Config')
  }

  if (isUndefined(auto.prefixes)) {
    throw new Error('Cannot find prefixes in Auto Config')
  }

  return auto.prefixes
}
