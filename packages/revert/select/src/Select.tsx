import { ParentBlock } from '@revert/block'
import React from 'react'
import { component, startWithType } from 'refun'
import { PrimitiveSelect } from './PrimitiveSelect'
import type { TSelect } from './types'

export const Select = component(
  startWithType<TSelect>()
)((props) => (
  <ParentBlock>
    <PrimitiveSelect {...props}/>
  </ParentBlock>
))

Select.displayName = 'Select'
Select.componentSymbol = Symbol('REVERT_SELECT')
