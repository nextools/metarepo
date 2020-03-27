import React from 'react'
import { component, startWithType } from 'refun'
import { ParentBlock } from '@revert/block'
import { PrimitiveSelect } from './PrimitiveSelect'
import { TSelect } from './types'

export const Select = component(
  startWithType<TSelect>()
)((props) => (
  <ParentBlock>
    <PrimitiveSelect {...props}/>
  </ParentBlock>
))

Select.displayName = 'Select'
Select.componentSymbol = Symbol('REVERT_SELECT')
