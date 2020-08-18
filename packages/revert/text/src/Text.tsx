import { InlineBlock } from '@revert/block'
import React from 'react'
import { component, startWithType } from 'refun'
import { PrimitiveText } from './PrimitiveText'
import type { TText } from './types'

export const Text = component(
  startWithType<TText>()
)((props) => (
  <InlineBlock shouldPreventWrap={props.shouldPreventWrap}>
    <PrimitiveText {...props}/>
  </InlineBlock>
))

Text.displayName = 'Text'
Text.componentSymbol = Symbol('REVERT_TEXT')
