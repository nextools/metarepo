import React from 'react'
import { component, startWithType } from 'refun'
import { ParentBlock } from '@revert/block'
import { TButton } from './types'
import { PrimitiveButton } from './PrimitiveButton'

export const Button = component(
  startWithType<TButton>()
)((props) => (
  <ParentBlock>
    <PrimitiveButton {...props}/>
  </ParentBlock>
))

Button.displayName = 'Button'
Button.componentSymbol = Symbol('REVERT_BUTTON')
