import React from 'react'
import { component, startWithType } from 'refun'
import { SYMBOL_BUTTON } from '../../symbols'
import { SizeParentBlock } from '../size-parent-block'
import { PrimitiveButton, TPrimitiveButton } from '../primitive-button'

export const SizeButton = component(
  startWithType<TPrimitiveButton>()
)((props) => (
  <SizeParentBlock>
    <PrimitiveButton {...props}/>
  </SizeParentBlock>
))

SizeButton.displayName = 'SizeButton'
SizeButton.componentSymbol = SYMBOL_BUTTON
