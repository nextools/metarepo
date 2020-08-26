
import { AnimationColor } from '@revert/animation'
import { InlineBlock } from '@revert/block'
import {
  Text as RevertText,
  PrimitiveText as RevertPrimitiveText,
} from '@revert/text'
import type { TText as TRevertText } from '@revert/text'
import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import type { TComponent } from 'refun'
import { TextThemeContext } from '../theme-context'

export type TText = Pick<TRevertText, 'shouldPreventWrap' | 'shouldHideOverflow' | 'shouldPreventSelection' | 'isUnderlined' | 'children'>

export const PrimitiveText = component(
  startWithType<TText>(),
  mapContext(TextThemeContext)
)((props) => (
  <AnimationColor toColor={props.color}>
    {(color) => (
      <RevertPrimitiveText {...props} color={color}/>
    )}
  </AnimationColor>
))

PrimitiveText.displayName = RevertPrimitiveText.displayName

export const Text: TComponent<TText> = (props) => (
  <InlineBlock shouldPreventWrap={props.shouldPreventWrap}>
    <PrimitiveText {...props}/>
  </InlineBlock>
)

Text.displayName = RevertText.displayName
Text.componentSymbol = RevertText.componentSymbol
