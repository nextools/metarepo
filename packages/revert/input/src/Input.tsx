import React from 'react'
import { component, startWithType } from 'refun'
import { ParentBlock } from '@revert/block'
import { TInput } from './types'
import { PrimitiveInput } from './PrimitiveInput'

export const Input = component(
  startWithType<TInput>()
)((props) => (
  <ParentBlock>
    <PrimitiveInput {...props}/>
  </ParentBlock>
))
