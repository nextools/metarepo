import type { TGraphEntry } from './types'

export const globalObject = global as unknown as Window

export const getHash = (graphs: TGraphEntry[]): string | null => {
  const hash = globalObject.location.hash.substr(1)
  const selectedGraphID = graphs.find(({ graphName }) => graphName === hash)

  return selectedGraphID ? hash : null
}

export const updateHash = (hash: string | null): void => {
  globalObject.history.replaceState(
    undefined,
    globalObject.document.title,
    hash !== null ? `#${hash}` : '#'
  )
}
