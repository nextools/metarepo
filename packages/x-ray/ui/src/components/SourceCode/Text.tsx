import { Text as PrimitiveText } from '@primitives/text'
import { TColor } from 'colorido'
import React, { FC } from 'react'
import { LINE_HEIGHT } from './constants'

export type TText = {
  color: TColor,
}

export const Text: FC<TText> = ({ color, children }) => (
  <PrimitiveText
    fontFamily="monospace"
    fontSize={14}
    lineHeight={LINE_HEIGHT}
    color={color}
    shouldPreserveWhitespace
  >
    {children}
  </PrimitiveText>
)
