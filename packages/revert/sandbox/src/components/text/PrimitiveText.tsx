import { PrimitiveText as RevertPrimitiveText } from '@revert/text'
import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { AnimationColor } from '../animation'
import { TextThemeContext } from '../theme-context'
import type { TText } from './types'

export const PrimitiveText = component(
  startWithType<TText>(),
  mapContext(TextThemeContext)
)(({
  color,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  children,
  shouldPreventWrap,
  shouldHideOverflow,
  shouldPreventSelection,
  isUnderlined,
}) => (
  <AnimationColor toColor={color}>
    {(color) => (
      <RevertPrimitiveText
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        fontSize={fontSize}
        lineHeight={lineHeight}
        color={color}
        shouldPreventWrap={shouldPreventWrap}
        shouldHideOverflow={shouldHideOverflow}
        shouldPreventSelection={shouldPreventSelection}
        isUnderlined={isUnderlined}
      >
        {children}
      </RevertPrimitiveText>
    )}
  </AnimationColor>
))

PrimitiveText.displayName = 'PrimitiveText'
PrimitiveText.componentSymbol = Symbol('SYMBOL_TEXT')
