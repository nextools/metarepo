import React from 'react'
import { component, startWithType } from 'refun'
import { ParentBlock, InlineBlock } from '@revert/block'
import { TButton } from './types'
import { PrimitiveButton } from './PrimitiveButton'

export const Button = component(
  startWithType<TButton>()
)(({ children, ...props }) => (
  <ParentBlock>
    <PrimitiveButton {...props}>
      <InlineBlock>
        {children}
      </InlineBlock>
    </PrimitiveButton>
  </ParentBlock>
))

Button.displayName = 'Button'
Button.componentSymbol = Symbol('REVERT_BUTTON')
