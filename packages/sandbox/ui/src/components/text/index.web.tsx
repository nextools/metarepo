import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { PrimitiveText } from '../primitive-text'
import { AnimationColor } from '../animation'
import { TextThemeContext } from '../theme-context'

export type TText = {
  shouldPreventWrap?: boolean,
  shouldHideOverflow?: boolean,
  shouldPreventSelection?: boolean,
  isUnderlined?: boolean,
}

export const Text = component(
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
      <PrimitiveText
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
      </PrimitiveText>
    )}
  </AnimationColor>
))

Text.displayName = 'Text'
Text.componentSymbol = Symbol('SYMBOL_TEXT')
