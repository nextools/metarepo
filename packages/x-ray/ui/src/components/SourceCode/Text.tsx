import React, { FC } from 'react'
import { TColor } from '@revert/color'
import { PrimitiveText } from '@revert/text'
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
