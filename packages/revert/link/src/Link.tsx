import { InlineBlock } from '@revert/block'
import React from 'react'
import type { TComponent } from 'refun'
import { PrimitiveLink } from './PrimitiveLink'
import type { TLink } from './types'

export const Link: TComponent<TLink> = (props) => (
  <InlineBlock>
    <PrimitiveLink {...props}/>
  </InlineBlock>
)

Link.displayName = 'Link'
Link.componentSymbol = Symbol('REVERT_LINK')
