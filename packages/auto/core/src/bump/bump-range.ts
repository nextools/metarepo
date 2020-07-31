import type { TReleaseType } from '../types'

const getRangeSymbol = (range: string): '^' | '~' | null => {
  const matches = range.match(/^([\^~])?\d.+$/)

  if (matches === null) {
    throw new Error(`range "${range}" is not supported`)
  }

  const symb = matches[1]

  if (typeof symb === 'undefined') {
    return null
  }

  return symb as '^' | '~'
}

export const bumpRange = (currentRange: string, newVersion: string, type: TReleaseType): string => {
  const symb = getRangeSymbol(currentRange)

  if (symb === null) {
    return newVersion
  }

  if (type === 'initial' && newVersion === '0.0.1') {
    return `${symb}${newVersion}`
  }

  if (type === 'patch') {
    return `${symb}${newVersion}`
  }

  return `^${newVersion}`
}
