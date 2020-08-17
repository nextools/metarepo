import type { TMetaFile, TComponents } from '../../types'

const cache = new Map<string, Promise<TMetaFile>>()

export const importMeta = (components: TComponents, key: string): Promise<TMetaFile> => {
  if (cache.has(key)) {
    return cache.get(key)!
  }

  const promise = components[key]()

  cache.set(key, promise)

  return promise
}
