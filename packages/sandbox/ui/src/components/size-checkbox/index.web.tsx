import React from 'react'
import { component, startWithType } from 'refun'
import { SYMBOL_CHECKBOX } from '../../symbols'
import { SizeParentBlock } from '../size-parent-block'
import { PrimitiveCheckbox, TPrimitiveCheckbox } from '../primitive-checkbox'

export const SizeCheckbox = component(
  startWithType<TPrimitiveCheckbox>()
)((props) => (
  <SizeParentBlock>
    <PrimitiveCheckbox {...props}/>
  </SizeParentBlock>
))

SizeCheckbox.displayName = 'SizeCheckbox'
SizeCheckbox.componentSymbol = SYMBOL_CHECKBOX
