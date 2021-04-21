import type { TColor } from '@revert/color'
import { PrimitiveText } from '@revert/text'
import type { ReactText, FC } from 'react'

export type TText = {
  color: TColor,
  children: ReactText,
}

export const Text: FC<TText> = ({ color, children }) => (
  <PrimitiveText
    fontFamily="monospace"
    fontSize={14}
    lineHeight={20}
    color={color}
    shouldPreserveWhitespace
  >
    {children}
  </PrimitiveText>
)
