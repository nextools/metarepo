import type { TTextChildren } from '@revert/text'
import type { FC } from 'react'
import { PrimitiveText } from '../text'

export type TText = {
  children: TTextChildren,
}

export const Text: FC<TText> = ({ children }) => (
  <PrimitiveText
    fontFamily="monospace"
    fontSize={14}
    lineHeight={20}
    shouldPreserveWhitespace
  >
    {children}
  </PrimitiveText>
)
