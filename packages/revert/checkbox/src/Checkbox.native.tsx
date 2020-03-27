import React from 'react'
import { component, startWithType } from 'refun'
import { ParentBlock } from '@revert/block'
import { PrimitiveCheckbox } from './PrimitiveCheckbox'
import { TCheckbox } from './types'

export const Checkbox = component(
  startWithType<TCheckbox>()
)((props) => (
  <ParentBlock>
    <PrimitiveCheckbox {...props}/>
  </ParentBlock>
))

Checkbox.displayName = 'Checkbox'
Checkbox.componentSymbol = Symbol('REVERT_CHECKBOX')
