import type { TComponents } from '@revert/sandbox'
import { metaContext } from './meta-context'

const toComponentName = (str: string): string => {
  return str
    .replace(/-(.)/g, ($1) => $1.toUpperCase())
    .replace(/-/g, '')
    .replace(/^(.)/, ($1) => $1.toUpperCase())
}

const metaPaths = metaContext.keys() as string[]

type TWriteable<T> = {
  -readonly [P in keyof T]: T[P]
}

// https://github.com/webpack/webpack/issues/9184
// https://github.com/webpack/changelog-v5/blob/master/README.md#named-chunk-ids
export const components: TComponents = metaPaths.reduce((acc, path) => {
  const matched = path.match(/\/([^/]+)\//)

  if (matched !== null) {
    const name = toComponentName(matched[1])

    acc[name] = () => metaContext(path)
  }

  return acc
}, {} as TWriteable<TComponents>)
