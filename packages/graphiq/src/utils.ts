import { TGraph } from './types'

export const globalObject = global as unknown as Window

export const getPastMonthsDate = (monthsAgo: number): Date => {
  const date = new Date()

  date.setMonth(date.getMonth() - monthsAgo)

  return date
}

export const getHash = (graphs: TGraph[]): string | null => {
  const hash = globalObject.location.hash.substr(1)
  const selectedGraphID = graphs.find(({ key }) => key === hash)

  return selectedGraphID ? hash : null
}

export const updateHash = (hash: string | null): void => {
  if (hash !== null) {
    globalObject.history.replaceState(undefined, globalObject.document.title, `#${hash}`)
  } else {
    globalObject.history.replaceState(undefined, globalObject.document.title, '#')
  }
}
