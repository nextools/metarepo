import { PrimitiveText } from '@revert/text'
import type { TPrimitiveText } from '@revert/text'
import type { FC } from 'react'
import { LINE_HEIGHT } from './constants'

export type TText = Pick<TPrimitiveText, 'color' | 'children'>

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
