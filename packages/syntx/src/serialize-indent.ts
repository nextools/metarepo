import { TConfig } from './types'

export const serializeIndent = (indent: number, { whitespaceChar, components: { Whitespace } }: TConfig) => (
  Whitespace(
    new Array(indent)
      .fill(whitespaceChar)
      .join('')
  )
)
