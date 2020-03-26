import { TPrefixes, TPackageJson } from '@auto/core'

export const getPrefixes = async (): Promise<TPrefixes> => {
  const path = await import('path')
  const { auto = {} }: TPackageJson = await import(path.resolve('package.json'))
  const prefixes = auto.prefixes

  if (typeof prefixes === 'undefined') {
    throw new Error('Cannot find "prefixes" in Auto Config')
  }

  if (!Reflect.has(prefixes, 'major')) {
    throw new Error('Cannot find "major" prefix in prefixes')
  }

  if (!Reflect.has(prefixes, 'minor')) {
    throw new Error('Cannot find "minor" prefix in prefixes')
  }

  if (!Reflect.has(prefixes, 'patch')) {
    throw new Error('Cannot find "patch" prefix in prefixes')
  }

  if (!Reflect.has(prefixes, 'initial')) {
    throw new Error('Cannot find "initial" prefix in prefixes')
  }

  if (!Reflect.has(prefixes, 'dependencies')) {
    throw new Error('Cannot find "dependencies" prefix in prefixes')
  }

  if (!Reflect.has(prefixes, 'publish')) {
    throw new Error('Cannot find "publish" prefix in prefixes')
  }

  return prefixes
}

