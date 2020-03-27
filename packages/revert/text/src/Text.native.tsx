import React from 'react'
import { component, startWithType } from 'refun'
import { InlineBlock } from '@revert/block'
import { PrimitiveText } from './PrimitiveText'
import { TText } from './types'

export const Text = component(
  startWithType<TText>()
)((props) => (
  <InlineBlock>
    <PrimitiveText {...props}/>
  </InlineBlock>
))

Text.displayName = 'Text'
Text.componentSymbol = Symbol('REVERT_TEXT')
