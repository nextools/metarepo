import React from 'react'
import { component, startWithType } from 'refun'
import { SYMBOL_DROPDOWN } from '../../symbols'
import { SizeParentBlock } from '../size-parent-block'
import { PrimitiveSelect, TPrimitiveSelect } from '../primitive-select'

export { Option, TOption } from '../primitive-select'

export const SizeSelect = component(
  startWithType<TPrimitiveSelect>()
)((props) => (
  <SizeParentBlock>
    <PrimitiveSelect {...props}/>
  </SizeParentBlock>
))

SizeSelect.displayName = 'SizeButton'
SizeSelect.componentSymbol = SYMBOL_DROPDOWN
