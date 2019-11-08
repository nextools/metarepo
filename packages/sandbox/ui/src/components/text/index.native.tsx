import React, { FC } from 'react'
import { TColor } from 'colorido'
import { Text as PrimitiveText } from '@primitives/text'
import { AnimationColor } from '../animation-color'

export const textHeight = 20

export type TText = {
  color: TColor,
  shouldPreventWrap?: boolean,
  shouldHideOverflow?: boolean,
  isBold?: boolean,
}

export const Text: FC<TText> = ({ color, children, shouldPreventWrap, shouldHideOverflow, isBold }) => (
  <AnimationColor values={color}>
    {(color) => (
      <PrimitiveText
        fontFamily={'Helvetica, Arial, sans-serif'}
        fontWeight={isBold ? 500 : 400}
        fontSize={16}
        lineHeight={20}
        color={color}
        shouldPreventWrap={shouldPreventWrap}
        shouldHideOverflow={shouldHideOverflow}
      >
        {children}
      </PrimitiveText>
    )}
  </AnimationColor>
)

Text.displayName = 'Text'
