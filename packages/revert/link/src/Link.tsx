import React from 'react'
import { component, startWithType } from 'refun'
import { InlineBlock } from '@revert/block'
import { PrimitiveLink } from './PrimitiveLink'
import { TLink } from './types'

export const Link = component(
  startWithType<TLink>()
)((props) => (
  <InlineBlock>
    <PrimitiveLink {...props}/>
  </InlineBlock>
))

Link.displayName = 'Link'
Link.componentSymbol = Symbol('REVERT_LINK')
