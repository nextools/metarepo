import { TYPE_WHITESPACE } from './constants'

export const serializeIndent = (currentIndent: number) => {
  if (currentIndent === 0) {
    return null
  }

  return {
    type: TYPE_WHITESPACE,
    value: new Array(currentIndent)
      .fill(' ')
      .join(''),
  }
}
