import React from 'react'
import { startWithType, component } from 'refun'
import { SYMBOL_LABEL } from '../../symbols'
import { SizeParentBlock } from '../size-parent-block'

export type TLabel = {}

export const Label = component(
  startWithType<TLabel>()
)(({ children }) => (
  <SizeParentBlock>
    {children}
  </SizeParentBlock>
))

Label.displayName = 'Label'
Label.componentSymbol = SYMBOL_LABEL
