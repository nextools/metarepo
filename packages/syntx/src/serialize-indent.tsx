import React from 'react'
import { TConfig } from './types'

export type TSerializeIndent = {
  currentIndent: number,
  config: TConfig,
}

export const serializeIndent = ({ currentIndent, config }: TSerializeIndent) => {
  const { components: { Whitespace } } = config

  return (
    <Whitespace>
      {
        new Array(currentIndent)
          .fill(config.whitespaceChar)
          .join('')
      }
    </Whitespace>
  )
}
