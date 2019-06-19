import { getObjectKeys, isUndefined } from 'tsfn'
import { TStylePrefix } from './types'
import { TStyle, TStyleKey } from './style'

const WINDOW = global as any as Window
const STYLES = WINDOW.document.documentElement.style as TStyle
const PREFIXES: TStylePrefix[] = ['Webkit', 'Moz', 'ms']

const cache = new Map<string, TStyleKey>()

const prefixStyleKey = (key: TStyleKey): TStyleKey => {
  if (cache.has(key)) {
    return cache.get(key)!
  }

  if (!isUndefined(STYLES[key])) {
    cache.set(key, key)

    return key
  }

  for (const prefix of PREFIXES) {
    const prefixedKey = `${prefix}${key.charAt(0).toUpperCase()}${key.slice(1)}` as TStyleKey

    if (!isUndefined(STYLES[prefixedKey])) {
      cache.set(key, prefixedKey)

      return prefixedKey
    }
  }

  cache.set(key, key)

  return key
}

export const prefixStyle = (styles: TStyle): TStyle =>
  getObjectKeys(styles).reduce((result, key) => {
    const prefixedKey = prefixStyleKey(key)

    // FIXME
    // @ts-ignore
    result[prefixedKey] = styles[key]

    return result
  }, {} as TStyle)

export * from './types'
export * from './style'
